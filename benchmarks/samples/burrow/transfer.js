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

module.exports.info = 'transfering money to account';

let bc, contx;
let initmoney,toAccount;

module.exports.init = function (blockchain, context, args) {
    if (!args.hasOwnProperty('money')) {
        return Promise.reject(new Error('account.transfer - \'money\' is missed in the arguments'));
    }
    bc = blockchain;
    contx = context;
    initmoney = args.money;
    toAccount = args.toAccount
    return Promise.resolve();
};

module.exports.run = function () {
    let args = [{
            'verb':'transfer',
            'toAccount': toAccount,
            'money': initmoney
     }];
    return bc.invokeSmartContract(contx, 'SimpleStorage', 'v0', args, 10);

};

module.exports.end = function () {
    // do nothing
    return Promise.resolve();
};
