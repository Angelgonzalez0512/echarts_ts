import app from "./app";
import config from "./config";
import { Server, ServerOptions } from "socket.io";
import moment from "moment";
const serve = app.listen(config.port, () => {
    console.log(`${config.APP_URL}:${config.port}`);
});
const io = new Server({
    cors: {
        origin: ["http://localhost:4200", "http://localhost"],
    }
}).listen(serve);
const random = () => Math.random() * (50 - 0) + 0;;

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    socket.on('message', (msg) => {
        io.emit('onmessage', msg);
    });
    socket.on('onupdatedata', (data) => {
        io.emit('onupdatedata', data);
    });
    setInterval(() => {
        io.emit('onupdatedata', { label: moment().format("HH:mm:ss"), data: random() });
    }, 2000);
});

