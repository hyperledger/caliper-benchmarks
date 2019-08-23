/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

module.exports.info = 'Querying a car.';

const helper = require('./helper');

let txIndex = 0;
let limitIndex, bc, contx;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    limitIndex = args.assets;

    await helper.createCar(bc, contx, args);

    return Promise.resolve();
};

module.exports.run = function() {
    txIndex++;
    let carNumber = 'Client' + contx.clientIdx + '_CAR' + txIndex.toString();

    let args = {
        chaincodeFunction: 'queryCar',
        chaincodeArguments: [carNumber]
    };

    if (txIndex === limitIndex) {
        txIndex = 0;
    }

    return bc.bcObj.querySmartContract(contx, 'fabcar', 'v1', args, 30);
};

module.exports.end = function() {
    return Promise.resolve();
};
