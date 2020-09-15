/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const helper = require('./helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class DeleteAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = '';
        this.assets = [];
        this.byteSize = 0;
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

        this.byteSize = args.byteSize;
        this.consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;

        const noSetup = args.noSetup ? (args.noSetup === 'true' || args.noSetup === true) : false;
        if (noSetup) {
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
        // Create argument array [functionName(String), otherArgs(String)]
        const uuid = this.assets.shift();
        const itemKey = 'client' + this.workerIndex + '_' + this.byteSize + '_' + uuid;

        const args = {
            contractId: this.chaincodeID,
            contractFunction: 'deleteAsset',
            contractArguments: [itemKey],
            readOnly: false
        };
    
        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new DeleteAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
