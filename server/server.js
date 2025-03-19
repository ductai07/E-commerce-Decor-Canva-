const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(cookieParser())

// Add CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

// Improved server startup with error handling
const startServer = () => {
    const server = app.listen(port, () => {
        console.log('Server running on the port: ' + port);
    });

    // Handle specific errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use. Trying port ${parseInt(port) + 1}...`);
            setTimeout(() => {
                server.close();
                // Try the next port
                process.env.PORT = parseInt(port) + 1;
                startServer();
            }, 1000);
        } else {
            console.error('Server error:', error);
        }
    });
};

startServer();