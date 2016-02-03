import {tester} from '../main';

describe('Invalid Hostname', () => {
    let InvalidHostnameTest = tester({
        url: 'http://i.dont.exist.grahamcox.co.uk'
    });
    
    describe('Valid Query to Invalid Host', () => {
        const response = InvalidHostnameTest('{ person(personID: 1) { name } }');
        
        it('Promise is rejected', () => {
            return response.should.eventually.be.rejected;
        });
    });
});
