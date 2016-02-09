import express from 'express';
import GraphQL from 'express-graphql';
import {create as createExpressWrapper} from '../../main/servers/express';
import {TestSchema} from './schema';
import {tester} from '../../main';

describe('Express Server', () => {
    const app = express();
    app.use('/express/graphql', GraphQL({
        schema: TestSchema
    }));

    const ExpressTest = tester({
        server: createExpressWrapper(app),
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
