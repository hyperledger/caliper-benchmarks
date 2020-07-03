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

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class RangeQueryAssetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.chaincodeID = '';
        this.pagesize = '';
        this.offset = 0;
        this.range = 0;
        this.consensus = false;
        this.bytesize = 0;
        this.nomatch = false;
        this.startKey = '';
        this.endKey = '';
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
        this.offset = parseInt(args.offset);
        this.range = parseInt(args.range);
        this.pagesize = args.pagesize;
        this.bytesize = args.bytesize;

        this.nomatch = args.nomatch ?  (args.nomatch === 'true' || args.nomatch === true): false;
        this.startKey = this.nomatch ? 'client_nomatch_' + this.offset : 'client' + this.workerIndex + '_' + this.bytesize + '_' + this.offset;
        this.endKey = this.nomatch ? 'client_nomatch_' + (this.offset + this.range) : 'client' + this.workerIndex
            + '_' + this.bytesize + '_' + (this.offset + this.range);

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
        // Create argument array [functionName(String), otherArgs(String)]
        const myArgs = {
            chaincodeFunction: 'paginatedRangeQuery',
            chaincodeArguments: [this.startKey, this.endKey, this.pagesize]
        };

        // consensus or non-con query
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
    return new RangeQueryAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
