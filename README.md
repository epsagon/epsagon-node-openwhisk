# Epsagon Instrumentation for OpenWhisk
[![Build Status](https://travis-ci.com/epsagon/epsagon-openwhisk.svg?token=wsveVqcNtBtmq6jpZfSf&branch=master)](https://travis-ci.com/epsagon/epsagon-openwhisk)
[![npm version](https://badge.fury.io/js/epsagon-openwhisk.svg)](https://badge.fury.io/js/epsagon-frameworks)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


## Installation

From your project directory:

```sh
npm install --save epsagon-openwhisk
```


## Getting started (Apache OpenWhisk)

You should pass the Epsagon token to your action as a default parameter, so that you don't
have to expose important credentials in your code. The name of the parameter can be configured using `token_param`, in this example we use `EPSAGON_TOKEN`

```javascript
const epsagon = require('epsagon');

function main(params) {
    // your main function
}

module.exports.main = epsagon.openWhiskWrapper(main, {
    token_param: 'EPSAGON_TOKEN', // name of the action parameter to take the token from
    appName: 'my-app-name'
    metadataOnly: false // Optional, send more trace data
});
```

You can then pass the `EPSAGON_TOKEN` as a default parameter into your action using the `wsk` command line client:

```bash
$ wsk action update <myaction> --parameter EPSAGON_TOKEN <your-epsagon-token>
```


## Copyright

Provided under the MIT license. See LICENSE for details.

Copyright 2019, Epsagon
