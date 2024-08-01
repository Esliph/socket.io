import { Socket as SocketNative, Server as ServerNative } from 'socket.io'
import { getPropertiesMethodsFromClass } from '../util/types'
import { getOptionsEvent } from './event'

export class Socket<SocketClient extends SocketNative = SocketNative, ServerApplication extends ServerNative = ServerNative> {
    get socketId() { return this.socket.id }
    get socket() { return this._socket }

    constructor(public io: ServerApplication, private _socket: SocketClient) { }

    _loadEvents(events: { event: string, methodName: string }[]) {
        for (let i = 0; i < events.length; i++) {
            const { event, methodName } = events[i]

            //@ts-expect-error
            this.socket.on(event, async (...data: any[]) => await this[methodName](...data))
        }
    }

    onConnected() { }
    onDisconnecting() { }
    onDisconnect() { }

    static getMapEvents() {
        const methodsEvents = getPropertiesMethodsFromClass(this as any)

        return methodsEvents
            .map(methodName => (getOptionsEvent(this as any, methodName) || []).map(config => ({ ...config, methodName })))
            .reduce((acc, options) => acc.concat(options), [])
    }
}