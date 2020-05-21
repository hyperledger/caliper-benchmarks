/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('./helper');

// Investigate a paginated range query that may or may not result in ledger appeding via orderer. Assets are created in the init phase
// with a byte size that is specified as in input argument. Pagesize and the number of existing test assets, as well as the range and offset, are also cofigurable. The arguments
// "nosetup" and "consensus" are optional items that are default false.
// - label: query-asset-100
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
//       pagesize: 10
//       range: 10
//       offset: 100
//       assets: 5000
//       nosetup: false
//       consensus: false
//     callback: benchmark/network-model/lib/range-query-asset.js


module.exports.info  = 'Paginated Range Querying Assets of fixed size.';

let chaincodeID;
let clientIdx, pagesize, offset, range, consensus;
let bc, contx, bytesize, nomatch, startKey, endKey;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    contx = context;

    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    offset = parseInt(args.offset);
    range = parseInt(args.range);
    pagesize = args.pagesize;
    bytesize = args.bytesize;

    nomatch = args.nomatch ?  (args.nomatch === 'true' || args.nomatch === true): false;
    startKey = nomatch ? 'client_nomatch_' + offset : 'client' + clientIdx + '_' + bytesize + '_' + offset;
    endKey = nomatch ? 'client_nomatch_' + (offset + range) : 'client' + clientIdx + '_' + bytesize + '_' + (offset + range);

    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;

    if (nosetup) {
        console.log('   -> Skipping asset creation stage');
    } else {
        console.log('   -> Entering asset creation stage');
        await helper.addBatchAssets(contx, clientIdx, args);
        console.log('   -> Test asset creation complete');
    }

    return Promise.resolve();
};

module.exports.run = function() {
    // Create argument array [functionName(String), otherArgs(String)]
    const myArgs = {
        chaincodeFunction: 'paginatedRangeQuery',
        chaincodeArguments: [startKey, endKey, pagesize]
    };

    // consensus or non-con query
    if (consensus) {
        return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
    } else {
        return bc.bcObj.querySmartContract(contx, chaincodeID, undefined, myArgs);
    }
};

module.exports.end = function() {
    return Promise.resolve();
};
