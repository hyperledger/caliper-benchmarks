/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


// Investigate a batch 'delete' that may or may not result in ledger appending via orderer. Assets are created in the init phase
// with a byte size that is specified as in input argument. The arguments "nosetup" and "consensus" are optional items that are default false.
// Must be run in a txNumber operation mode, as assets must exist for the benchmark to be valid.
// - label: batch-delete-asset-100
//      chaincodeID: fixed-asset
//      txNumber: 1000
//      rateControl: { type: fixed-backlog,  opts: { unfinished_per_client: 20, startingTps: 10} }
//      arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//          create_sizes: [8000]
//          assets: 50000
//          bytesize: 8000
//          batchsize: 50
//          consensus: true
//      callback: benchmarks/api/fabric/lib/batch-delete-asset.js

const helper = require('./helper');

module.exports.info  = 'Batch Delete Asset of fixed size.';

let chaincodeID;
let clientIdx, assets, bytesize, consensus, batchsize;
let bc, contx;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    contx = context;

    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    let assetNumber = args.assets ? parseInt(args.assets) : 0;
    assets = helper.retrieveRandomAssetIds(assetNumber);

    batchsize = args.batchsize ? parseInt(args.batchsize) : 1;

    bytesize = args.bytesize;
    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;

    if (nosetup) {
        console.log('   -> Skipping asset creation stage');
    } else {
        console.log('   -> Entering asset creation stage');
        await helper.addBatchAssets(bc.bcObj, contx, clientIdx, args);
        console.log('   -> Test asset creation complete');
    }

    return Promise.resolve();
};

module.exports.run = function() {
    // Create argument array [consensus(boolean), functionName(String), otherArgs(String)]
    const uuids = [];
    for (let i=0; i<batchsize; i++) {
        // pick one of the randomized items and remove it from future consideration
        const uuid = assets.shift();
        const key = 'client' + clientIdx + '_' + bytesize + '_' + uuid;
        uuids.push(key);
    }

    const batch = {};
    batch.uuids = uuids;

    const myArgs = {
        chaincodeFunction: 'deleteAssetsFromBatch',
        chaincodeArguments: [JSON.stringify(batch)]
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
