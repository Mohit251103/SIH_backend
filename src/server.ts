import http from 'http';
import serverConfig from './config/expressConfig';
import * as process from 'process';
import { mongooseConnect } from './config/mongooseConfig';
import SocketConfig from './config/socketConfig';

require('dotenv').config();

const port = process.env.PORT || 3000;
(async () => {
    const app = await serverConfig();

    // getting the dialect from .env file
    if (!process.env.DB_DIALECT) {
        throw new Error('DB_DIALECT not found in .env file');
    }


    // Connect to the database
        try {
            await mongooseConnect();
        } catch (err) {
            console.error('Unable to connect to the database:', err);
            throw err;
        }
    // Create an HTTP server instance
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with the HTTP server
    const io = SocketConfig.init(httpServer);

    io.on('connection', (socket) => {
        SocketConfig.socketListener(io, socket);
    });
    // End Initialize Socket.IO

    // Start listening for HTTP requests
    httpServer.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
})();
