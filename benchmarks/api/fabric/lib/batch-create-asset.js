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

const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class BatchCreateAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = '';
        this.asset = {};
        this.bytesize = 0;
        this.batchsize = 0;
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {BlockchainInterface} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        const args = this.roundArguments;
        this.chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
        this.bytesize = args.bytesize ? parseInt(args.bytesize) : 100;
        this.batchsize = args.batchsize ? parseInt(args.batchsize) : 1;

        this.asset = {
            docType: this.chaincodeID,
            content: '',
            creator: 'client' + this.workerIndex,
            bytesize: this.bytesize
        };

        const rand = 'random';
        let idx = 0;
        while (bytes(JSON.stringify(this.asset)) < this.bytesize) {
            const letter = rand.charAt(idx);
            idx = idx >= rand.length ? 0 : idx+1;
            this.asset.content = this.asset.content + letter;
        }
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const batch = [];
        for (let i = 0; i < this.batchsize; i++) {
            this.asset.uuid = 'client' + this.workerIndex + '_' + this.bytesize + '_' + this.txIndex;
            const batchAsset = JSON.parse(JSON.stringify(this.asset));
            batch.push(batchAsset);
            this.txIndex++;
        }

        const myArgs = {
            chaincodeFunction: 'createAssetsFromBatch',
            chaincodeArguments: [JSON.stringify(batch)]
        };
        return this.sutAdapter.invokeSmartContract(this.chaincodeID, undefined, myArgs);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new BatchCreateAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
