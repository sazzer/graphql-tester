import request from 'request';
import freeport from 'freeport';

export function tester({
    url,
    server,
    method = 'POST',
    contentType = 'application/graphql'
}) {
    return (query) => {
        return new Promise((resolve, reject) => {
            if (server) {
                freeport((err, port) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(server.creator(port)
                            .then((baseUrl) => baseUrl + url));
                    }
                });
            } else {
                resolve(url);
            }
        }).then((realUrl) => {
            console.log(`Sending query ${query} to ${realUrl}`);
            return new Promise((resolve, reject) => {
                request({
                    method,
                    uri: realUrl,
                    headers: {
                        'Content-Type': contentType
                    },
                    body: query
                }, (error, message, body) => {
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
