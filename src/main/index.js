export function tester({
    url,
    method = 'POST',
    contentType = 'application/graphql'
}) {
    return (query) => {
        return new Promise((resolve, reject) => {
            resolve({
                success: true,
                status: 200,
                data: {
                    person: {
                        name: 'Luke Skywalker'
                    }
                }
            });
        });
    };
}
