/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('../helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class PreloadAssetsWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = '';
        this.assetsPerWorker = [];
        this.asset = {};
        this.byteSize = 0;
        this.assetPrefix = null;
        this.transactionHasRun = false;
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
        this.keys = args.assets ? parseInt(args.assets) : 0;
        this.chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
        this.byteSize = args.byteSize ? args.byteSize : 100;
        this.batchSize = args.batchSize ? parseInt(args.batchSize) : 1;
        this.assetsPerWorker = helper.getAssetsPerWorker(args.assets, this.workerIndex, totalWorkers);
        this.batchesNum = Math.ceil(this.assetsPerWorker/this.batchSize);

        this.asset = {
            docType: this.chaincodeID,
            content: '',
            creator: 'client' + this.workerIndex,
            byteSize: this.byteSize
        };

        const paddingSize = this.byteSize - helper.bytes(JSON.stringify(this.asset));
        this.assetPrefix = 'client' + this.workerIndex + '_' + this.byteSize + '_';
        this.asset.content = 'B'.repeat(paddingSize);
        this.transactionHasRun = false;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        if (this.transactionHasRun) {
            console.log('A Worker should only ever submit this transaction once, please make sure TxNumber and Workers are the same value');
            console.log('Transaction NOT submitted');
            return;
        }

        this.transactionHasRun = true;
        for (let i = 0; i < this.batchesNum; i++) {
            let batch = [];
            for (let i = 0; (i < this.batchSize) && (this.txIndex < this.assetsPerWorker); i++) {
                this.asset.uuid = this.assetPrefix + this.txIndex;
                const batchAsset = JSON.parse(JSON.stringify(this.asset));
                batch.push(batchAsset);
                this.txIndex++;
            }

            const args = {
                contractId: this.chaincodeID,
                contractFunction: 'createAssetsFromBatch',
                contractArguments: [JSON.stringify(batch)],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(args);
        }
    }
}
/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new PreloadAssetsWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
