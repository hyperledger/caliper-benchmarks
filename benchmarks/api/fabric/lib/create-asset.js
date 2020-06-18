/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Investigate submitTransaction() using network model to create an asset of specific size in the registry
// - label: create-asset-100
//     chaincodeID: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//       bytesize: 100
//     callback: benchmark/network-model/lib/create-asset.js

module.exports.info  = 'Creating Asset in Registry';

let chaincodeID;
// const appmetrics = require('appmetrics');
// require('appmetrics-dash').monitor({appmetrics: appmetrics});
// appmetrics.enable('profiling');
const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

let txIndex = 0;
let clientIdx;
let asset;
let bc, contx, bytesize;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;
    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    bytesize = args.bytesize;

    asset = {docType: chaincodeID, content: ''};
    asset.creator = 'client' + clientIdx;
    asset.bytesize = bytesize;

    const rand = 'random';
    let idx = 0;
    while (bytes(JSON.stringify(asset)) < bytesize) {
        const letter = rand.charAt(idx);
        idx = idx >= rand.length ? 0 : idx+1;
        asset.content = asset.content + letter;
    }

    contx = context;
};

module.exports.run = function() {
    const uuid = 'client' + clientIdx + '_' + bytesize + '_' + txIndex;
    asset.uuid = uuid;
    txIndex++;
    const myArgs = {
        chaincodeFunction: 'createAsset',
        chaincodeArguments: [uuid, JSON.stringify(asset)]
    };
    return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
};

module.exports.end = function() {
    return Promise.resolve();
};
