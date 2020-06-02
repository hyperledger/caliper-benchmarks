/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('./helper');

module.exports.info  = 'Get private Asset of fixed size.';

const chaincodeID = 'fixed-asset';
let clientIdx, assets, bytesize, consensus;
let bc, contx;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientIdx = context.clientIdx;

    contx = context;

    assets = args.assets ? parseInt(args.assets) : 0;

    bytesize = args.bytesize;
    consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;

    if (nosetup) {
        console.log('   -> Skipping asset creation stage');
    } else {
        console.log('   -> Entering asset creation stage');
        await helper.addBatchAssets(bc.bcObj, contx, clientIdx, args, true);
        console.log('   -> Test asset creation complete');
    }

    return Promise.resolve();
};

module.exports.run = function() {
    // Create argument array [functionName(String), otherArgs(String)]
    const uuid = Math.floor(Math.random() * Math.floor(assets));
    const itemKey = 'client' + clientIdx + '_' + bytesize + '_' + uuid;

    const myArgs = {
        chaincodeFunction: 'getPrivateAsset',
        chaincodeArguments: [itemKey]
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
