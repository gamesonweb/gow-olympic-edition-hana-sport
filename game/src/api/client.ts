import * as jspb from "google-protobuf";
import {Create, GetMessageID} from "./pb/factory";
import {EventList} from "../logic/util/eventList";

export default class ApiClient {
    private _socket: WebSocket;
    private _connected: boolean = false;
    private _serverUrl: string;
    private _handlers: { [key: number]: ((message: jspb.Message) => void)[] } = {};
    private _sessionInfo: { id: string, name: string };

    public onConnectionError: EventList = new EventList();

    constructor(serverUrl: string) {
        this._serverUrl = serverUrl;
    }

    public setSessionInfo(id: string, name: string): void {
        if (this._connected) {
            console.error('[ApiClient] Session info can only be set before connecting');
            return;
        }
        this._sessionInfo = {id, name};
    }

    public send(message: jspb.Message): void {
        if (this._connected) {
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

    public connectAsync(): Promise<void> {
        if (this._connected) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
            if (this._socket) {
                this._socket.close();
            }
            this._socket = new WebSocket(`${this._serverUrl}?id=${this._sessionInfo.id}&name=${this._sessionInfo.name}`);
            this._socket.binaryType = 'arraybuffer';
            this._socket.onopen = () => {
                this._connected = true;
                this._socket.onmessage = (event) => {
                    const buffer = new Uint8Array(event.data);
                    const id = buffer[0];
                    const data = buffer.slice(1);
                    const message = Create(id, data);
                    if (message) {
                        const handler = this._handlers[message.constructor];
                        if (handler) {
                            for (const h of handler) {
                                h(message);
                            }
                        } else {
                            console.error('[ApiClient] No handler for message: ' + message.constructor.name);
                        }
                    } else {
                        console.error('[ApiClient] Invalid message ID: ' + id);
                    }
                };
                resolve();
            };
            this._socket.onerror = (event) => {
                console.error('[ApiClient] Connection error: ' + event);
                reject();
            };
            this._socket.onclose = () => {
                if (this._connected) {
                    console.error('[ApiClient] Connection closed');
                    this.onConnectionError.trigger();
                }
                this._connected = false;
            };
        });
    }

    public onMessage(message: jspb.Message, handler: (message: jspb.Message) => void): void {
        if (!this._handlers[message.constructor]) {
            this._handlers[message.constructor] = [];
        }
        this._handlers[message.constructor].push(handler);
    }

    public get connected(): boolean {
        return this._connected;
    }
}