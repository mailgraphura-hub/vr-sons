import dotenv from "dotenv";
import app from "./app.js"
import databaseConfig from "./config/db.config.js";
import http from "http";
import { initSocket } from "./config/socketIo.config.js";

dotenv.config({
    path: "./.env"
});

databaseConfig();

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT|| 3000;


server.listen(PORT, () => {
    if (PORT) {
        console.log(`✅ Backend running successfully on PORT: ${PORT}`);
    } else {
        console.error("❌ Backend failed to start: PORT is undefined.");
    }
});

