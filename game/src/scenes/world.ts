import {
    AbstractMesh,
    CubeTexture,
    DirectionalLight,
    FreeCamera,
    HavokPlugin,
    PhysicsAggregate,
    PhysicsShapeType,
    SceneLoader,
    SceneOptimizer,
    SceneOptimizerOptions, TransformNode,
    Vector3
} from "@babylonjs/core";
import {Engine} from "@babylonjs/core/Engines/engine";
import Level from "../logic/level/level";
import PlayerCamera from "../management/component/playerCamera";
import PlayerInput from "../management/component/playerInput";
import Scene from "./scene";
import SceneConfig from "../logic/config/scene";
import CinematicComponent from "../management/component/cinematic";
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera";
import MeshProvider from "../management/meshprovider";
import AudioComponent from "../management/component/audio";
import HavokPhysics from "@babylonjs/havok";
import ConfigTable from "../logic/config/table";

export default class WorldScene extends Scene {
    private static readonly CAMERA_SPEED: number = 8;
    private static readonly CAMERA_OFFSET: Vector3 = new Vector3(0, 0.8, -5);
    private static readonly CAMERA_TARGET_OFFSET: Vector3 = new Vector3(0, 0.4, 0);

    private _config: SceneConfig;

    private _level: Level;
    private _initialized: boolean = false;

    private _sun: DirectionalLight;
    private _optimizer: SceneOptimizer;

    constructor(engine: Engine, config: SceneConfig) {
        super(engine);
        this._level = new Level(config, this);
        this._config = config;
        this.onDispose = () => {
            this._level.destroy();
        };

        const options = SceneOptimizerOptions.ModerateDegradationAllowed(60);
        this._optimizer = new SceneOptimizer(this, options, true, true);
    }

    public get level(): Level {
        return this._level;
    }

    public async init(): Promise<void> {
        await super.init();

        const havokInterface = await HavokPhysics();
        const havokPlugin = new HavokPlugin(true, havokInterface);
        this.enablePhysics(new Vector3(0, -5, 0), havokPlugin);
        this.physicsEnabled = false;

        await this.createTerrain();

        this.environmentTexture = new CubeTexture("https://assets.babylonjs.com/environments/environmentSpecular.env", this);

        await this.debugLayer.show();

        this.blockMaterialDirtyMechanism = true;

        const cinematicCamera = this.cameras[0] as FreeCamera;
        const playerCamera = new TargetCamera("PlayerCamera", Vector3.Up(), this, true);
        this.activeCamera = playerCamera;

        this.addComponent(new PlayerCamera(this, this.activeCamera as TargetCamera, WorldScene.CAMERA_OFFSET, WorldScene.CAMERA_TARGET_OFFSET, WorldScene.CAMERA_SPEED));
        this.addComponent(new CinematicComponent(this, cinematicCamera, this._level));
        this.addComponent(new PlayerInput(this));
        this.addComponent(new AudioComponent(this, this._level));

        this.loadLevel();

        this._sun = this.lights[0] as DirectionalLight;
        this._sun.autoCalcShadowZBounds = true;

        const cinematicNode = this.transformNodes.find(t => t.name === 'Cinematic');
        if (cinematicNode) {
            for (const subNode of cinematicNode.getChildTransformNodes()) {
                subNode.unfreezeWorldMatrix();
            }
        } else {
            throw new Error('cinematic node not found');
        }

        /*const defaultPipeline = new DefaultRenderingPipeline("default", true, this, [this.activeCamera, cinematicCamera]);
        defaultPipeline.bloomEnabled = true;
        defaultPipeline.bloomThreshold = 0.05;
        defaultPipeline.bloomWeight = 0.35;
        defaultPipeline.bloomScale = 1;
        defaultPipeline.bloomKernel = 32;

        defaultPipeline.imageProcessingEnabled = true;
        defaultPipeline.imageProcessing.contrast = 1.10;
        defaultPipeline.imageProcessing.exposure = 1.15;
        defaultPipeline.imageProcessing.toneMappingEnabled = false;
        defaultPipeline.imageProcessing.vignetteEnabled = true;
        defaultPipeline.imageProcessing.vignetteWeight = 2.5;
        defaultPipeline.imageProcessing.vignetteStretch = 0.5;*/

        /*const skybox = Mesh.CreateBox("skyBox", 5000.0, this);
        const skyboxMaterial = new StandardMaterial("skyBox", this);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", this);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;*/

        this._initialized = true;
        //this._optimizer.start();

        await MeshProvider.instance.executeAsync();

        console.log('scene initialized');
    }

    private loadLevel() {
        const sceneObjects = this._config.objects;
        this._level.load(sceneObjects);
        this._level.battle.setPlayers([
            {
                id: "player",
                name: "Test",
                characterConfig: ConfigTable.characters[0].id
            }
        ]);

        const player = this._level.battle.getPlayerCharacterById("player")
        const playerCamera = this.getComponent(PlayerCamera);
        if (playerCamera !== null) {
            playerCamera.target = player;
        }

        const playerInput = this.getComponent(PlayerInput);
        if (playerInput !== null) {
            playerInput.character = player;
        }
    }

    private async createTerrain() : Promise<void> {
        const assetRootPath = "assets/level/" + this._config.name + "/";
        const assetLoaderPromises = [];

        for (const model of this._config.models) {
            // convert unity coordinates to babylon coordinates
            //const position = new Vector3(model.position.x, model.position.y, model.position.z);
            //const rotation = new Vector3(-model.rotation.x * Math.PI / 180, model.rotation.z * Math.PI / 180, model.rotation.y * Math.PI / 180);
            //const scaling = new Vector3(-model.scale.x, model.scale.y, model.scale.z);

            assetLoaderPromises.push(this.loadModelAsync(assetRootPath + model.path, Vector3.Zero(), Vector3.Zero(), new Vector3(-1, 1, 1)));
        }

        await Promise.all(assetLoaderPromises);
    }

    private async loadModelAsync(path: string, position: Vector3, rotation: Vector3, scaling: Vector3): Promise<void> {
        console.log("Loading model", path);
        
        const model = await SceneLoader.ImportMeshAsync("", path, null, this);
        const root = model.meshes[0];

        root.position = position;
        root.rotation = rotation;
        root.scaling = scaling;

        for (const child of model.meshes) {
            this._optimizeMesh(child);
        }

        const groundMesh = model.meshes.find(m => m.name === 'Ground');
        if (groundMesh) {
            new PhysicsAggregate(groundMesh, PhysicsShapeType.BOX, {mass: 0, friction: 1, restitution: 0.1});
        }

        const propsTransform = model.transformNodes.find(t => t.name.endsWith('Props'));
        if (propsTransform) {
            for (const child of propsTransform.getChildMeshes()) {
                if (child.name.endsWith("_NoCollider")) {
                    continue;
                }
                new PhysicsAggregate(child, PhysicsShapeType.MESH, { mass: 0, friction: 1, restitution: 0.1 });
            }
        }
    }

    private _optimizeMesh(mesh: AbstractMesh) {
        mesh.computeWorldMatrix(true);
        mesh.freezeWorldMatrix();
        mesh.checkCollisions = false;
        // mesh.isPickable = false;

        if (mesh.material) {
            mesh.material.freeze();
        }

        mesh.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
    }

    private updateLogic() {
        if (!this._initialized) {
            return;
        }

        const step = Math.min(this.getEngine().getDeltaTime() / 1000, 1);
        this.getPhysicsEngine()._step(step);
        this._level.update(step);
    }

    public update() {
        this.updateLogic();
        super.update();
    }
}