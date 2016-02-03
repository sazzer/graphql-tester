GraphQL Tester
==============
[![Build Status](https://travis-ci.org/sazzer/graphql-tester.svg?branch=master)](https://travis-ci.org/sazzer/graphql-tester)

Module for writing fluent tests against a GraphQL API.

Example
-------
This example works against the live SWAPI Implementation available on http://graphql-swapi.parseapp.com. There is a real test, using [Mocha](http://mochajs.org) and [Chai](http://chaijs.com) for this under test/swapi/simple-swapi.tests.js

```javascript
import {tester} from 'graphql-tester';

const test = tester({
    url: 'http://graphql-swapi.parseapp.com'
});

// This tests a successful request for the name of person 1
test('{person(personID: 1) { name } }')
    .then((response) => {
        assert(response.success == true);
        assert(response.status == 200);
        assert(response.data.person.name == 'Like Skywalker');
    });

// This tests a request for the name of non-existant person 1234
test('{person(personID: 1234) { name } }')
    .then((response) => {
        assert(response.success == false);
        assert(response.status == 200);
    });

// This tests a malformed query
test('{person(personId: 1) { name } }')
    .then((response) => {
        assert(response.success == false);
        assert(response.status == 400);
    });
```

API
---
At it's core, this library allows you to make a request to a service and perform assertions on the response. The way that the request query is generated, and the response is asserted is entirely up to you. The above example uses a simple string for the query, and the core *assert* method. However, there is no need to use these mechanisms and you can use whatever makes the most sense for your tests.

### tester
The "tester" function is used to create a function that can be used to test a specific API. At creation time it is given all of the details needed to call the API, and then it can be used to make requests and get responses from the API. This function takes a single Object as a parameter, with the following keys:

* url - The URL to make requests to. This is required.
* method - The HTTP Method to use for the requests. This is optional, and will default to POST
* contentType - The Content Type Header to set for the requests. This is optional, and will default to "application/graphql"

This function will return a function that can be used to make requests to the API. This returned function takes a single parameter as being the GraphQL Query to execute, and will return a Promise for the response from the server. This Promise will be resolved with an Object containing:
* success - True if the query was a success. False if not. Note that in this case Success means there was no "errors" element returned.
* status - The HTTP Status Code of the response received.
* headers - The HTTP Headers of the response received.
* raw - The raw response that was received.
* data - The "data" element in the response from the server, if present.
* errors - The "errors" element in the response from the server, if present.

If there was a catastrophic failure in making the request - connection refused, for example - then the Promise will instead be rejected.

Note that because a Promise is returned you get some benefits here. You can use this promise as a return in certain promise-aware testing tools - e.g. Mocha. You can also use the same promise to make assertions fit better into some BDD style tests.
