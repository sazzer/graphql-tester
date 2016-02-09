import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import {TestSchema} from './schema';
import {tester} from '../../main';

describe('Hapi Server', () => {
    let HapiTest = tester({
        server: {
            creator: (port) => {
                const server = new Hapi.Server();
                server.connection({
                    port
                });
                
                return server.register([
                    {
                        register: GraphQL,
                        options: {
                            query: {
                              schema: TestSchema,
                              rootValue: {},
                              pretty: false
                            },
                            route: {
                              path: '/hapi/graphql',
                              config: {}
                            }
                        }
                    }
                ])
                .then(() => server.start())
                .then(() => {
                    return {
                        server: {
                            shutdown: () => {
                                console.log(`Shutting down server on port ${port}`);
                                server.stop();
                            }
                        },
                        url: server.info.uri
                    };
                });
            }
        },
        url: '/hapi/graphql'
    });
    
    describe('Valid Query', () => {
        const response = HapiTest('{ test(who: "Graham") }');
        
        it('Returns success', () => {
            return response.should.eventually.have.property('success').equal(true);
        });
        it('Returns the correct Status code', () => {
            return response.should.eventually.have.property('status').equal(200);
        });
        it('Returns the correct name', () => {
            return response.should.eventually.have.deep.property('data.test').equal('Hello Graham');
        });
    });
    
    describe('Invalid Query', () => {
        const response = HapiTest('{ somethingElse(who: "Graham") }');
        
        it('Returns success', () => {
            return response.should.eventually.have.property('success').equal(false);
        });
        it('Returns the correct Status code', () => {
            return response.should.eventually.have.property('status').equal(400);
        });
        it('Returns some errors', () => {
            return response.should.eventually.have.property('errors');
        });
    });
});
