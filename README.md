GraphQL Tester
==============
[![Build Status](https://travis-ci.org/sazzer/graphql-tester.svg?branch=master)](https://travis-ci.org/sazzer/graphql-tester)

Module for writing fluent tests against a GraphQL API.

Example
-------
This example works against the live SWAPI Implementation available on http://graphql-swapi.parseapp.com. There is a real test, using [Mocha](http://mochajs.org) and [Chai](http://chaijs.com) for this under src/test/swapi/simple-swapi.tests.js

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
        assert(response.data.person.name == 'Luke Skywalker');
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

* url - The URL to make requests to. This is required. This must be absolute if the "server" parameter is not provided, and should be relative to the Base URL of the server if the "server" parameter is provided.
* server - The configuration for starting an application server to test against. This is optional, but if present then the url must be relative to this server.
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

#### "server" parameter
When the "tester" function is used to create the GraphQL Tester to use, it is possible to pass in an Application Server configuration. This configuration will be used to start up an Application Server before each test is run, execute the query against this server and then shut the server down. Helper functions are provided to configure an Application Server for use with Express 4.x and HapiJS. Any other server can be used though, as long as you provide the configuration yourself.

##### Express 4.x
An example of testing against an Express Server can be seen in src/test/servers/express-server.test.js.

In order to configure the tester to work against an Express server, you simply need to use the "create" function exported from the "graphql-tester/servers/express" module. This function is called with the configured but not-yet-running Express server, and returns the full configuration to pass in to the "server" property of the "tester" function.

##### HapiJS
An example of testing against a HapiJS Server can be seen in src/test/servers/hapi-server.test.js.

In oder to configure the tester to work against a HapiJS Server, you simply need to use the "create" function exported from the "graphql-tester/servers/hapi" module. This function is called with the plugin configuration to configure HapiJS with - this can be anything that you can legally pass to Hapi.Server.Register - and will return the full configuration to pass in to the "server" property of the "tester" function.

##### Arbitrary Application servers
It is possible to use any arbitrary application server by providing the configuration yourself. This configuration currently takes the form of a Javascript Object that has a single key of "creator". This key is a function that is called with the port number to listen on - this will be dynamically generated every test - and should return a Promise for the server configuration. This server configuration should be a Javascript object that has keys of:
* url - The base URL of the server. Note that this is *not* the URL to the GraphQL endpoint - that should be passed in to the "url" property of the "tester" function as usual, but should be relative to this Base URL.
* server - This is a Javascript object with a single key - "shutdown" - which is a function to shut the running server down at the end of the test. This is optional, but if not provided then it will not be possible to shut the servers down and eventually the test process is likely to crash from a lack of resources.

Note that because of how this works, it is possible to start a server before the tests run and re-use it between all tests - simply return the URL to the singleton server and never return a function to shut it down. This might be useful in some circumstances but it greatly increases the likelihood of cross-contamination of tests.
