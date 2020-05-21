/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


// Investigate submitTransaction() or evaluateTransaction() by calling a nullRepsonse chaincode function. Passed argument
// "consensus" is an optional (default false) argument to conditionally use the ordering service.
// - label: null-response-ordered
//     chaincodeID: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//       consensus: true
//     callback: benchmark/network-model/lib/null-response.js

module.exports.info  = 'Null Repsonse';

let chaincodeID;
let bc, contx, consensus;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    contx = context;
};

module.exports.run = function() {

    // Create argument array [functionName(String), otherArgs(String)]
    const myArgs = {
        chaincodeFunction: 'emptyContract',
        chaincodeArguments: []
    };

    if (consensus) {
        return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
    } else {
        return bc.bcObj.querySmartContract(contx, chaincodeID, undefined, myArgs);
    }

};

module.exports.end = function() {
    return Promise.resolve();
};
