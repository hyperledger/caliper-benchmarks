/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Investigate submitTransaction() using network model to create a batch of assets of specific size in the registry
// - label: batch-create-asset-1000
//     chaincodeID: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//       bytesize: 1000
//       batchsize: 100
//     callback: benchmark/network-model/lib/batch-create-asset.js

module.exports.info  = 'Batch Creating Assets in Registry';

const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

let txIndex = 0;
let chaincodeID;
let clientIdx;
let asset;
let bc, contx, bytesize, batchsize;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    bytesize = args.bytesize ? parseInt(args.bytesize) : 100;
    batchsize = args.batchsize ? parseInt(args.batchsize) : 1;

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

    const batch = [];
    for (let i=0; i<batchsize; i++) {
        asset.uuid = 'client' + clientIdx + '_' + bytesize + '_' + txIndex;
        const batchAsset = JSON.parse(JSON.stringify(asset));
        batch.push(batchAsset);
        txIndex++;
    }

    const myArgs = {
        chaincodeFunction: 'createAssetsFromBatch',
        chaincodeArguments: [JSON.stringify(batch)]
    };
    return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
};

module.exports.end = function() {
    return Promise.resolve();
};
