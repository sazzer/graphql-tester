import express from 'express';
import GraphQL from 'express-graphql';
import {TestSchema} from './schema';
import {tester} from '../../main';

describe('Express Server', () => {
    let ExpressTest = tester({
        server: {
            creator: (port) => {
                const server = express();
                server.use('/express/graphql', GraphQL({
                    schema: TestSchema
                }));

                return new Promise((resolve, reject) => {
                    const app = server.listen(port, () => {
                        resolve({
                            server: {
                                shutdown: () => {
                                    app.close();
                                }
                            },
                            url: `http://localhost:${port}`
                        });
                    });
                });
            }
        },
        url: '/express/graphql'
    });

    describe('Valid Query', () => {
        const response = ExpressTest('{ test(who: "Graham") }');

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
        const response = ExpressTest('{ somethingElse(who: "Graham") }');

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
