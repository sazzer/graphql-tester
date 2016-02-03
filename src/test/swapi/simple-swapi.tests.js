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
    
    describe('Getting the name of Person #1234', () => {
        const response = SwapiTest('{ person(personID: 1234) { name } }');
        
        it('Returns failure', () => {
            return response.should.eventually.have.property('success').equal(false);
        });
        it('Returns the correct Status code', () => {
            return response.should.eventually.have.property('status').equal(200);
        });
        it('Returns some errors', () => {
            return response.should.eventually.have.property('errors');
        });
    });
    
    describe('Incorrect argument requested', () => {
        const response = SwapiTest('{ person(personId: 1) { name } }');
        
        it('Returns failure', () => {
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
