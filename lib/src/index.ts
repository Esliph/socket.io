import { Namespace, Server as ServerNative, Socket as SocketNative } from 'socket.io'
import { Socket } from './components/socket'
import { ClassConstructor } from './util/types'

export interface DefaultEventsMap {
    [event: string]: (...args: any[]) => void;
}

export interface EventsMap {
    [event: string]: any;
}

export class Application<ListenEvents extends EventsMap = DefaultEventsMap, EmitEvents extends EventsMap = ListenEvents, ServerSideEvents extends EventsMap = DefaultEventsMap, SocketData = any> extends ServerNative<ListenEvents, EmitEvents, ServerSideEvents, SocketData> {

    build<SocketClient extends SocketNative = SocketNative>(socketClass: ClassConstructor<Socket<SocketClient>>) {
        this.buildOf('/', socketClass)
    }

    buildOf<SocketClient extends SocketNative = SocketNative>(namespace: string, socketClass: ClassConstructor<Socket<SocketClient>>) {
        this.buildNamespace(this.of(namespace), socketClass)
    }

    private buildNamespace(namespace: Namespace, socketClass: ClassConstructor<Socket>) {
        const mapEvents: { event: string, methodName: string }[] = (socketClass as any).getMapEvents() || []

        namespace.on('connection', socket => Application.createSocket(namespace, socketClass, socket, mapEvents))
    }

    private static createSocket(namespace: Namespace, socketClass: ClassConstructor<Socket>, socket: SocketNative, events: { event: string, methodName: string }[] = []) {
        const socketIO = new socketClass(namespace, socket)

        socketIO._loadEvents(events)

        socketIO.onConnected()

        socket.on('disconnect', () => socketIO.onDisconnect())
        socket.on('disconnecting', () => socketIO.onDisconnecting())
    }
}