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

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class BatchDeleteAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.chaincodeID = '';
        this.assets = [];
        this.bytesize = 0;
        this.batchsize = 0;
        this.consensus = false;
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
        let assetNumber = args.assets ? parseInt(args.assets) : 0;
        this.assets = helper.retrieveRandomAssetIds(assetNumber);

        this.batchsize = args.batchsize ? parseInt(args.batchsize) : 1;
        this.bytesize = args.bytesize;
        this.consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;

        const nosetup = args.nosetup ? (args.nosetup === 'true' || args.nosetup === true) : false;
        if (nosetup) {
            console.log('   -> Skipping asset creation stage');
        } else {
            console.log('   -> Entering asset creation stage');
            await helper.addBatchAssets(this.sutAdapter, this.sutContext, this.workerIndex, args);
            console.log('   -> Test asset creation complete');
        }
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        // Create argument array [consensus(boolean), functionName(String), otherArgs(String)]
        const uuids = [];
        for (let i = 0; i < this.batchsize; i++) {
            // pick one of the randomized items and remove it from future consideration
            const uuid = this.assets.shift();
            const key = 'client' + this.workerIndex + '_' + this.bytesize + '_' + uuid;
            uuids.push(key);
        }

        const batch = {};
        batch.uuids = uuids;

        const myArgs = {
            chaincodeFunction: 'deleteAssetsFromBatch',
            chaincodeArguments: [JSON.stringify(batch)]
        };

        if (this.consensus) {
            return this.sutAdapter.invokeSmartContract(this.chaincodeID, undefined, myArgs);
        } else {
            return this.sutAdapter.querySmartContract(this.chaincodeID, undefined, myArgs);
        }
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new BatchDeleteAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
