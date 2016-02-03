import request from 'request';

export function tester({
    url,
    method = 'POST',
    contentType = 'application/graphql'
}) {
    return (query) => {
        return new Promise((resolve, reject) => {
            request({
                method,
                uri: url,
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
    };
}
