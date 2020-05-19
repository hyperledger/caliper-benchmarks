/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


// Investigate a paginated rich query that may or may not result in ledger appeding via orderer. Assets are created in the init phase
// with a byte size that is specified as in input argument. Pagesize and the number of existing test assets are also cofigurable. The argument
// "nosetup" and "consensus" are optional items that are default false. Resulting mago query is that whch targets assets created by the same client
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
//       assets: 5000
//       nosetup: true
//     callback: benchmark/network-model/lib/rich-query-asset.js


module.exports.info  = 'Paginated Rich Querying Assets of fixed size.';

const helper = require('./helper');

let chaincodeID;
let clientIdx, pagesize, mangoQuery, consensus;
let bc, contx, bytesize, nomatch;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    contx = context;

    chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
    bytesize = args.bytesize;
    pagesize = args.pagesize;

    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true) : false;
    nomatch = args.nomatch ?  (args.nomatch === 'true' || args.nomatch === true): false;
    const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;

    console.log('   -> Rich query test configured with consensus flag set to ', consensus.toString());

    // Create a mango query that returns assets created by this client only
    mangoQuery = {
        'selector': {
            'docType': chaincodeID,
            'creator': nomatch ? 'client_nomatch' : 'client' + clientIdx,
            'bytesize': bytesize
        }
    };

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
        chaincodeFunction: 'paginatedRichQuery',
        chaincodeArguments: [JSON.stringify(mangoQuery), pagesize]
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
