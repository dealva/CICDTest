const express = require('express');
const next = require('next');
const { createServer } = require('node:http');
const { Server: SocketServer } = require('socket.io');
const url = require('node:url');

const app = express();  // Initialize Express app
const dev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev });
const fs = require('fs');
const path = require('path');
const mailer = require('./src/mailer');  // Import mailer module
const Queue = require('bull');  // Import Bull for job queueing
const { Registry, collectDefaultMetrics , Counter , Histogram } = require('prom-client')

const instrument =new Registry
global.instrument=instrument

const httpRequestMetrics= new Counter({
    name: 'nextjs_http_request',
    help: 'Total HTTP Request',
    labelNames: ['method','path','status'],
    registers:[instrument]
})

global.httpRequestMetrics=httpRequestMetrics

const httpRequestDurationMetrics =new Histogram({
    name: 'nextjs_http_request_duration',
    help: 'Total HTTP Request',
    labelNames: ['method','path','status','duration'],
    buckets: [0.1,0.5,1,1.5,2,2.5,5,10],
    registers:[instrument]
})
global.httpRequestDurationMetrics=httpRequestDurationMetrics
collectDefaultMetrics({ register: instrument })

nextApp.prepare().then(() => {
    const emailQueue = new Queue('email', {
        redis: { host: 'localhost', port: 6379 }
    });
    global.emailQueue = emailQueue;  // Make emailQueue globally accessible
    // Log to check if nextApp.prepare() completes successfully
    const server = createServer(app);  // Create an HTTP server with Express
    console.log('Next.js is prepared');

    // Initialize socket.io with the server
    const socket = new SocketServer(server, {
        cors: {
            origin: '*', // You can restrict this to a specific origin if needed
        },
    });

    // Set up socket.io connection handling
    socket.on('connection', (client) => {
        console.log(`Client connected ${client.id}`);

        client.on("joinRoom", ({ roomId, userId}) => {
            console.log(`Client ${userId} joined room ${roomId}`);
            client.join(`room-${roomId}`);
            client.to(`room-${roomId}`).emit('message', { message: `User ${userId} has joined the room` });
            client.on('leaveRoom', () => {
                client.leave(`room-${roomId}`);
                client.to(`room-${roomId}`).emit('message', { message: `User ${userId} has left the room` });
            });
            client.on('sendMessage', (data) => {
                client.to(`room-${roomId}`).emit('receiveMessage', data);
            });
        });

        
    });

    // Handle all requests through Next.js
    app.all('*all', (req, res) => {
        const startTime=Date.now()

        res.on('finish', () => {
            const endTime= Date.now()
            const duration= (endTime-startTime)/1000
            const logEntry = {
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                status: res.statusCode,
                duration
            };
            if (!req.path.match(/^\/_next|\/api\/metrics|\/favicon\.icon/)){
                httpRequestMetrics.inc({
                    method: req.method,
                    path: req.path,
                    status: res.statusCode
                })    
                httpRequestDurationMetrics.observe({
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration
                }, duration)
                 // Append log line to file (for ELK)
                fs.appendFile(
                    path.join(__dirname, 'logs', 'access.log'),
                    JSON.stringify(logEntry) + '\n',
                    (err) => {
                        if (err) console.error('Log write error:', err);
                    }
                );    
              
            }
            // console.log(req.path)
        
        })
        return nextApp.getRequestHandler()(req, res, url.parse(req.originalUrl, true));  // Let Next.js handle routing
    });

    // Start the server on port 3000
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
    emailQueue.process(async (job) => {
        await mailer.sendMail(job.data);
        console.log('Email sent successfully:', job.data);
    });

});
