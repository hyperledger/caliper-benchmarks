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

module.exports.info = 'Querying all cars.';

const helper = require('./helper');

let startingKey, endingKey, bc, contx;

module.exports.init = async function (blockchain, context, args) {
    bc = blockchain;
    contx = context;

    await helper.createCar(bc, contx, args);

    startingKey = 'Client' + contx.clientIdx + '_CAR' + args.startKey;
    endingKey = 'Client' + contx.clientIdx + '_CAR' + args.endKey;

    return Promise.resolve();
};

module.exports.run = function () {

    let args = {
        chaincodeFunction: 'queryAllCars',
        chaincodeArguments: [startingKey, endingKey]     
    };

    return bc.bcObj.querySmartContract(contx, 'fabcar', 'v1', args, 60)

};

module.exports.end = function () {
    return Promise.resolve();
};
