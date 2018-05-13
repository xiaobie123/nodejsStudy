const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
var chatServer = require('./lib/chat_server');
const cache = {};

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('error 404: respurce not found.');
    response.end();
}
function sendFile(response, filePath, fileContents) {
    const type = mime.getType(path.basename(filePath));
    response.writeHead(200, {'Content-Type': type });
    response.end(fileContents.toString());
}
function serverStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath,(esists) => {
            if(esists) {
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                }); 
            } else {
                send404(response);
            }
        })
        // fs.open(absPath, 'wx', (err, fd) => {
        //     if (err) {
        //         if (err.code === 'ENOENT') {
        //           send404(response);
        //           return;
        //         }
        //         throw err;
        //       }
        //       fs.readFile(absPath, (err, data) => {
        //         if (err) {
        //             send404(response);
        //         } else {
        //             cache[absPath] = data;
        //             sendFile(response, cache, data);
        //         }
        //     }); 
        //   });
    }
}
const server = http.createServer((request, response) => {
    let PUBLIC_PATH = path.resolve(__dirname, './public');
    if (request.url === '/') {
        filePath = PUBLIC_PATH + '/index.html';
    } else {
        filePath = PUBLIC_PATH + request.url;
    }
    const absPath = filePath;
    serverStatic(response, cache, absPath);
});

server.listen(3000, () => {
    console.log('server listening on port 3000');
})

chatServer.listen(server);