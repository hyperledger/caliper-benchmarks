/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class CreateAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = '';
        this.asset = {};
        this.byteSize = 0;
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
        this.byteSize = args.byteSize;

        this.asset = {
            docType: this.chaincodeID,
            content: '',
            creator: 'client' + this.workerIndex,
            byteSize: this.byteSize
        };

        const paddingSize = this.byteSize - bytes(JSON.stringify(this.asset));
        this.asset.content = 'B'.repeat(paddingSize);
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const uuid = 'client' + this.workerIndex + '_' + this.byteSize + '_' + this.txIndex;
        this.asset.uuid = uuid;
        this.txIndex++;
        const args = {
            contractId: this.chaincodeID,
            contractFunction: 'createAsset',
            contractArguments: [uuid, JSON.stringify(this.asset)],
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
    return new CreateAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
