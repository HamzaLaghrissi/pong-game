import http from 'http';
import { Server as ServerIO } from 'socket.io';
import RequestController from './controllers/requestController.js';
import IOController from './controllers/ioController.js';
import * as msg from './scripts/messageConstants.js';

const server = http.createServer(
	(request, response) => new RequestController(request, response).handleRequest()
);

const io = new ServerIO(server);
const ioController = new IOController(io);
const limit = 2;

io.on(msg.CONNECTION, socket => {
	if (io.engine.clientsCount > limit){
		io.to(socket.id).emit(msg.FULL);
	}
	else{
		ioController.registerSocket(socket);
		if (io.engine.clientsCount == 1)
			io.to(socket.id).emit(msg.HOST)
		else
			io.to(socket.id).emit(msg.GUEST)
	}
  })

server.listen(8080);
