/**
 * Create an Express.js wrapper that can be used for running tests against
 * @param {Application} app The Express.js Application that should be used to test against
 * @return {Object} configuration to pass to the GraphQL Tester for using this server
 */
export function create(app) {
    return {
        creator: (port) => {
            return new Promise((resolve, reject) => {
                const server = app.listen(port, () => {
                    resolve({
                        server: {
                            shutdown: () => {
                                server.close();
                            }
                        },
                        url: `http://localhost:${port}`
                    });
                });
            });
        }
    };
}
