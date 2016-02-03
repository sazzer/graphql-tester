import {tester} from '../../main';

describe('SWAPI', () => {
    let SwapiTest = tester({
        url: 'http://graphql-swapi.parseapp.com'
    });
    
    describe('Successfully getting the name of Person #1', () => {
        const response = SwapiTest('{ person(personID: 1) { name } }');
        
        it('Returns success', () => {
            return response.should.eventually.have.property('success').equal(true);
        });
        it('Returns the correct Status code', () => {
            return response.should.eventually.have.property('status').equal(200);
        });
        it('Returns the correct name', () => {
            return response.should.eventually.have.deep.property('data.person.name').equal('Luke Skywalker');
        });
    });
});
