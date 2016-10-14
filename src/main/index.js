import request from 'request';
import freeport from 'freeport';

export function tester({
    url,
    server,
    method = 'POST',
    contentType = 'application/graphql',
    authorization = null
}) {
    return (query) => {
        return new Promise((resolve, reject) => {
            if (server) {
                freeport((err, port) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(server.creator(port)
                            .then((runningServer) => {
                                return {
                                    server: runningServer.server,
                                    url: runningServer.url + url
                                }
                            }));
                    }
                });
            } else {
                resolve({
                    url
                });
            }
        }).then(({url, server}) => {
            return new Promise((resolve, reject) => {
                let headers = {
                    'Content-Type': contentType,
                };
                if (authorization !== null) headers['Authorization'] = authorization;

                request({
                    method,
                    uri: url,
                    headers: headers,
                    body: query
                }, (error, message, body) => {
                    if (server && typeof(server.shutdown) === 'function') {
                        server.shutdown();
                    }
                    
                    if (error) {
                        reject(error);
                    } else {
                        const result = JSON.parse(body);
                        
                        resolve({
                            raw: body,
                            data: result.data,
                            errors: result.errors,
                            headers: message.headers,
                            status: message.statusCode,
                            success: !result.hasOwnProperty('errors')
                        });
                    }
                });
            });
        });
    };
}
