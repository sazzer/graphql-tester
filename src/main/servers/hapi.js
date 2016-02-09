import Hapi from 'hapi';

/**
 * Create a HapiJS wrapper that can be used for running tests against
 * @param {Object|Array} plugins The HapiJS plugins to register against the instance
 * @return {Object} configuration to pass to the GraphQL Tester for using this server
 */
export function create(plugins) {
    return {
        creator: (port) => {
            const server = new Hapi.Server();
            server.connection({
                port
            });
            
            return server.register(plugins)
                .then(() => server.start())
                .then(() => {
                    return {
                        server: {
                            shutdown: () => {
                                server.stop();
                            }
                        },
                        url: server.info.uri
                    };
                });
        }
    };
}
