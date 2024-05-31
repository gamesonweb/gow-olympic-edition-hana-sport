import Config from "./config";

export default interface AudioConfig extends Config {
    volume: number;
    loop: boolean;
    audio: string;
    area: number[];
}