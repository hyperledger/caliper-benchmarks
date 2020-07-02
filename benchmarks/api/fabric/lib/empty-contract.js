/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


// Investigate submitTransaction() or evaluateTransaction() by calling a nullRepsonse chaincode function. Passed argument
// "consensus" is an optional (default false) argument to conditionally use the ordering service.
// - label: null-response-ordered
//     chaincodeID: fixed-asset
//     txNumber:
//     - 1000
//     rateControl:
//     - type: fixed-rate
//       opts:
//         tps: 50
//     arguments:
//       chaincodeID: fixed-asset | fixed-asset-base
//       consensus: true
//     callback: benchmark/network-model/lib/null-response.js

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class EmptyContractWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.chaincodeID = 'fixed-asset';
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
        this.consensus = args.consensus ? (args.consensus === 'true' || args.consensus === true): false;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        // Create argument array [functionName(String), otherArgs(String)]
        const myArgs = {
            chaincodeFunction: 'emptyContract',
            chaincodeArguments: []
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
    return new EmptyContractWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
