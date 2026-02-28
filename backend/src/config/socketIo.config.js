import {Server, Socket} from "socket.io";

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors:{
            origin:"*",
            methods:["GET", "POST", "PATCH"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket Connected", socket.id);

        socket.on("joinCustomerRoom", (customerId) => {
            if(!customerId) return;
            socket.join(`customer_${customerId}`);
            console.log(`Customer joined room: customer_${customerId}`);
        })

        socket.on("joinAdminRoom", () => {
            socket.join("admin_room");
            console.log("Admin joined admin_room");
        });

        socket.on("disconnect", () => {
            console.log("Socket Disconnect:", socket.id)
        });
    });

    return io;
};

const getIO = () => {
    if(!io) throw new Error("Socket not initialized");
    return io;
}

export {initSocket, getIO}