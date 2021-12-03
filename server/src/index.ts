import app from "./app";
import config from "./config";
import { Server, ServerOptions } from "socket.io";
import * as faker from 'faker';
const serve = app.listen(config.port, () => {
    console.log(`${config.APP_URL}:${config.port}`);
});
const io = new Server({
    cors: {
        origin: ["http://localhost:4200"],
    }
}).listen(serve);
const random = () => Math.floor(Math.random() * 100);
const randomName = () => faker.name.firstName() + ' ' + faker.name.lastName();

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
        io.emit('onupdatedata', { labels: [randomName(), randomName(), randomName(), randomName(), randomName(), randomName()], data: [random(), random(), random(), random(), random(), random()] });
    }, 10000);
});

