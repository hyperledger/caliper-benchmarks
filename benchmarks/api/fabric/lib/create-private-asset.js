/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

module.exports.info  = 'Creating private Asset in Registry';

const chaincodeID = 'fixed-asset';
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
}

module.exports.run = function() {
    const uuid = 'client' + clientIdx + '_' + bytesize + '_' + txIndex;
    asset.uuid = uuid;
    txIndex++;
    
    const myArgs = {
        chaincodeFunction: 'createPrivateAsset',
        chaincodeArguments: [uuid],
        transientMap: {content: JSON.stringify(asset)}
    }

    return bc.bcObj.invokeSmartContract(contx, chaincodeID, undefined, myArgs);
}

module.exports.end = function() {
    return Promise.resolve();
};
