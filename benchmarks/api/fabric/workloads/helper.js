/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

module.exports.bytes = function(s) {
    return ~-encodeURI(s).split(/%..|./).length;
};

/**
 * Retrieve an array containing randomized UUIDs
 * @param {number} assetNumber number of random asset uuids required to be in a return array
 */
module.exports.retrieveRandomAssetIds = function(assetNumber) {
    const uuids = [...Array(assetNumber).keys()];
    // shuffle array using Fisher-Yates shuffle
    for (let i = uuids.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // swap elements uuids[i] and uuids[j]
        [uuids[i], uuids[j]] = [uuids[j], uuids[i]];
    }
    return uuids;
}

/**
 * Retrieve an array containing randomized UUIDs from range
 * @param {number} assetNumber number of random asset uuids required to be in a return array
 * @param {number} startRange beginning of range from which get the number of random numbers
 * @param {number} finishRange end of range from which get the number of random numbers
 */
 module.exports.retrieveRandomAssetIdsFromRange = function(assetNumber, startRange, finishRange) {
    const difference = finishRange - startRange;
    const ids = [];
    while (ids.length < assetNumber) {
       const id = startRange + Math.floor(Math.random() * difference); 
       if (!ids.includes(id)) {
          ids.push(id)
       }
    }
    return ids;
 }

/**
 * Insert asset batches
 * @param {Object} bcObj the BC object
 * @param {Object} context the BC context
 * @param {Integer} clientIdx the client index
 * @param {Object} args the client arguments
 */
module.exports.addBatchAssets = async function(bcObj, context, clientIdx, args, isPrivateData = false) {
    console.log('   -> Creating assets of sizes: ', args.create_sizes);

    const testAssetNum = args.assets ? parseInt(args.assets) : 0;
    for (let index in args.create_sizes) {
        const size = args.create_sizes[index];
        console.log('   -> Creating asset set of byte size: ', size);
        const uuidBase = 'client' + clientIdx + '_' + size + '_';

        // define the asset to be created in this loop
        const baseAsset = {};
        baseAsset.docType = 'fixed-asset';
        baseAsset.byteSize = size;
        baseAsset.creator = 'client' + clientIdx;
        baseAsset.uuid = uuidBase;

        // Create assets in batches, because it is faster!!
        // -Complete the asset definition
        const paddingSize = size - this.bytes(JSON.stringify(baseAsset));
        baseAsset.content = 'B'.repeat(paddingSize);

        // -Generate all assets
        const assets = [];
        for (let i=0; i<testAssetNum; i++) {
            const asset = {};
            asset.docType = baseAsset.docType;
            asset.byteSize = baseAsset.byteSize;
            asset.creator = baseAsset.creator;
            asset.content = baseAsset.content;
            asset.uuid = uuidBase + i;
            assets.push(asset);
        }

        // -Break into batches of (max) 50
        const batches = [];
        let idx = 0;
        while(assets.length) {
            batches[idx]=assets.splice(0,50);
            idx++;
        }

        // -Insert each batch
        for (const index in batches) {
            const batch = batches[index];
            try {
                let myArgs;
                if(!isPrivateData) {
                    myArgs = {
                        contractFunction: 'createAssetsFromBatch',
                        contractArguments: [JSON.stringify(batch)]
                    };
                } else {
                    myArgs = {
                        contractFunction: 'createPrivateAssetsFromBatch',
                        contractArguments: ['50'],
                        transientMap: {content: JSON.stringify(batch)}
                    }
                }

                myArgs.contractId = 'fixed-asset';
                myArgs.readOnly = false;

                await bcObj.sendRequests(myArgs);
            } catch (err) {
                console.error('Error: ', err);
                throw err;
            }
        }
    }
};

/**
 * Insert asset batches of mixed size
 * @param {Object} bcObj the BC object
 * @param {Object} context the BC context
 * @param {Integer} clientIdx the client index
 * @param {Object} args the client arguments
 */
module.exports.addMixedBatchAssets = async function(bcObj, context, clientIdx, args) {
    console.log('   -> Creating assets of byte-size: ', args.create_sizes);

    const testAssetNum = args.assets ? parseInt(args.assets) : 0;
    const uuidBase = 'client' + clientIdx + '_';

    const baseAssets = [];
    // Define base assets sizes
    for (let index in args.create_sizes) {
        const size = args.create_sizes[index];

        // define the asset to be created in this loop
        const baseAsset = {};
        baseAsset.docType = 'fixed-asset';
        baseAsset.byteSize = size;
        baseAsset.creator = 'client' + clientIdx;
        baseAsset.uuid = uuidBase;

        // Create assets in batches, because it is faster!!
        // -Complete the asset definition
        const paddingSize = size - this.bytes(JSON.stringify(baseAsset));
        baseAsset.content = 'B'.repeat(paddingSize);

        baseAssets.push(baseAsset);
    }

    // -Generate all assets
    const assets = [];
    let idx = 0;
    for (let i=0; i<testAssetNum; i++) {
        // loop over baseAssets defined above
        const asset = {};
        asset.docType = baseAssets[idx].docType;
        asset.byteSize = baseAssets[idx].byteSize;
        asset.creator = baseAssets[idx].creator;
        asset.content = baseAssets[idx].content;
        asset.uuid = uuidBase + i;
        assets.push(asset);
        idx = (idx + 1) % args.create_sizes.length;
    }

    // -Break into batches of (max) 50
    const batches = [];
    idx = 0;
    while(assets.length) {
        batches[idx]=assets.splice(0,50);
        idx++;
    }

    // -Insert each batch
    console.log('   -> Adding ' + batches.length + ' batch(es) to DB');
    for (const index in batches) {
        const batch = batches[index];
        try {
            const myArgs = {
                contractId: 'fixed-asset',
                contractFunction: 'createAssetsFromBatch',
                contractArguments: [JSON.stringify(batch)]
            };
            await bcObj.sendRequests(myArgs);
        } catch (err) {
            console.error('Error: ', err);
            throw err;
        }
    }
};

/**
 * get total asset to create per worker
 * @param {string} assets total number of assets to create
 * @param {number} workerIndex index of worker
 * @param {number} totalWorkers total number of workers
 */
 module.exports.getAssetsPerWorker = function(assets, workerIndex, totalWorkers) {
    const assetNumber = assets ? parseInt(assets) : 2;
    let assetsPerWorker = Math.floor(assetNumber / totalWorkers);
    if (workerIndex == 0) {
        const reminder = assetNumber % totalWorkers;
        assetsPerWorker += reminder;
    }
    return assetsPerWorker;
 }
