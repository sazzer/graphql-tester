import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import {TestSchema} from './schema';
import {tester} from '../../main';

describe('Hapi Server', () => {
    const server = new Hapi.Server();

    server.register({
        register: GraphQL,
        options: {
            query: {
              schema: TestSchema,
              rootValue: {},
              pretty: false
            },
            route: {
              path: '/graphql',
              config: {}
            }
        }
    });
    
    let InvalidHostnameTest = tester({
        server: server,
        url: '/graphql'
    });
    
    describe('Valid Query', () => {
        const response = InvalidHostnameTest('{ test(who: "Graham") }');
        
        it('Returns success', () => {
            return response.should.eventually.have.property('success').equal(true);
        });
        it('Returns the correct Status code', () => {
            return response.should.eventually.have.property('status').equal(200);
        });
        it('Returns the correct name', () => {
            return response.should.eventually.have.deep.property('data').equal('Hello Graham');
        });
    });
});
