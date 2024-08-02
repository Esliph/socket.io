import { ServerOptions } from 'socket.io'
import { Application as ApplicationServer } from '../'
import { Socket } from '../components/socket'

export class SocketApplication extends Socket {

    onConnected() {
        console.log(this.socketId, 'connected')
    }

    onDisconnect() {
        console.log(this.socketId, 'disconnected')
    }
}

class Application extends ApplicationServer {

    listen(srv: number, opts?: Partial<ServerOptions>) {
        super.listen(srv, opts)

        this.on('new_namespace', (namespace) => {
            console.log('new namespace', namespace.name)
        })

        return this
    }
}

export const app = new Application({
    cors: { origin: '*' }
})

app.build(SocketApplication)
app.listen(3000)