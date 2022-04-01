import * as msg from './../scripts/messageConstants.js';

export default class IOController {

    #io
    constructor(io){
        this.#io = io;
    }
    
    registerSocket(socket){
        this.setupListeners(socket);
        console.log(`New connection with ${socket.id}`);
    }

    setupListeners(socket){
        socket.on(msg.DISCONNECT, () => this.disconnectAll(socket))
        socket.on(msg.FULL, () => this.serverFull(socket))
        socket.on(msg.LEAVE, () => this.disconnectAll(socket))
        socket.on(msg.ENOUGH, () => this.enoughPlayers(socket))

        socket.on(msg.START, () => socket.broadcast.emit(msg.START))
        socket.on(msg.STOP, () => socket.broadcast.emit(msg.STOP))
        socket.on(msg.SYNCBALL, (shiftX, shiftY, x, y) => socket.broadcast.emit(msg.SYNCBALL, shiftX, shiftY, x, y))
        socket.on(msg.UP, (y) => socket.broadcast.emit(msg.UP, y));
        socket.on(msg.DOWN, (y) => socket.broadcast.emit(msg.DOWN, y));
        socket.on(msg.OTHERLAUNCH, (y) => socket.broadcast.emit(msg.OTHERLAUNCH, y));
        socket.on(msg.STOPMOVING, () => socket.broadcast.emit(msg.STOPMOVING));
        socket.on(msg.SYNCSCORES, (leftScore, rightScore) => socket.broadcast.emit(msg.SYNCSCORES, leftScore, rightScore));
    }

    disconnectAll(socket){
        socket.broadcast.emit(msg.OTHERDISC);
        this.#io.fetchSockets().then((sockets) => {
            sockets.forEach( s => {
            s.disconnect();
          })
        });
    }

    enoughPlayers(socket){
        socket.broadcast.emit(msg.CANSTART)
    }

    serverFull(socket){
        socket.disconnect();
    }
    
}