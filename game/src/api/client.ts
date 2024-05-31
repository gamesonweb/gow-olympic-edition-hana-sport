import {Message} from "google-protobuf";
import {Create, GetMessageID} from "./pb/factory";
import {EventList} from "../logic/util/eventList";

export default class ApiClient {
    public static instance: ApiClient = new ApiClient();

    private _socket: WebSocket;
    private _connected: boolean = false;
    private _handlers: Map<number, (message: Message) => void> = new Map();
    private _sessionInfo: { id: string, name: string };
    private _connecting: boolean = false;

    public onConnectionError: () => void;

    public setSessionInfo(id: string, name: string): void {
        if (this._connected) {
            console.error('[ApiClient] Session info can only be set before connecting');
            return;
        }
        this._sessionInfo = {id, name};
    }

    public send(message: Message): void {
        if (this._connected) {
            console.log('[ApiClient] Send message: ' + message.constructor.name);
            const id = GetMessageID(message);
            const data = message.serializeBinary();
            const buffer = new Uint8Array(data.length + 1);
            buffer[0] = id;
            buffer.set(data, 1);
            this._socket.send(buffer);
        } else {
            console.error('[ApiClient] Send failed: not connected (message: ' + message.constructor.name + ')');
        }
    }

    public isConnecting(): boolean {
        return this._connecting;
    }

    public get sessionId(): string {
        return this._sessionInfo.id;
    }

    public connectAsync(serverUrl: string): Promise<void> {
        if (this._connected) {
            return Promise.resolve();
        }
        this._connecting = true;
        return new Promise<void>((resolve, reject) => {
            if (this._socket) {
                this._socket.close();
            }
            this._socket = new WebSocket(`${serverUrl}?id=${this._sessionInfo.id}&name=${this._sessionInfo.name}`);
            this._socket.binaryType = 'arraybuffer';
            this._socket.onopen = () => {
                this._connected = true;
                this._socket.onmessage = (event) => {
                    const buffer = new Uint8Array(event.data);
                    const id = buffer[0];
                    const data = buffer.slice(1);
                    const message = Create(id, data);
                    if (message) {
                        console.log('[ApiClient] Received message: ' + message.constructor.name);
                        const handler = this._handlers.get(id);
                        if (handler) {
                            handler(message);
                        } else {
                            console.error('[ApiClient] No handler for message ID: ' + id);
                        }
                    } else {
                        console.error('[ApiClient] Invalid message ID: ' + id);
                    }
                };
                this._connecting = false;

                resolve();
            };
            this._socket.onerror = (event) => {
                console.error('[ApiClient] Connection error: ' + event);
                this._connecting = false;
                reject();
            };
            this._socket.onclose = () => {
                if (this._connected) {
                    console.error('[ApiClient] Connection closed');
                    if (this.onConnectionError) {
                        this.onConnectionError();
                    }
                }
                this._connected = false;
                this._connecting = false;
            };
        });
    }

    public addHandler(id: number, handler: (message: Message) => void): void {
        this._handlers.set(id, handler);
    }

    public get connected(): boolean {
        return this._connected;
    }
}