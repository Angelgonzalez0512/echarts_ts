import app from "./app";
import config from "./config";
import { Server, ServerOptions } from "socket.io";
import moment from "moment";
import { fake } from "faker/locale/es";
import faker from 'faker';
const serve = app.listen(app.get("port"), () => {
    console.log(`${config.APP_URL}:${config.port}`);
});
const io = new Server({
    cors: {
        origin: ["http://localhost:4200", "http://localhost:4200" ],
    }
}).listen(serve);
const random = () => Math.random() * (42 - 21) + 21;
const randomhumedad=()=>Math.random() * (100 - 25) + 25;
const randomloss=()=>Math.random() * (-1 +10) -10;
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
        var  temperatura=random();
        io.emit('onupdatedata', { label: moment().format("HH:mm:ss"), data: temperatura,data2:randomhumedad() });
    }, 7000);
});

