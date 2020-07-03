/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class Workload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.account_array = [];
        this.initmoney = 0;
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

        if (!this.roundArguments.hasOwnProperty('money')) {
            throw new Error('account.transfer - \'money\' is missed in the arguments');
        }

        this.initmoney = this.roundArguments.money;

        const open = require('./open.js');
        this.account_array = open.account_array;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const account1 = this.account_array[Math.floor(Math.random() * (this.account_array.length))];
        const account2 = this.account_array[Math.floor(Math.random() * (this.account_array.length))];
        let args;

        if (this.sutAdapter.getType() === 'fabric') {
            args = {
                chaincodeFunction: 'transfer',
                chaincodeArguments: [account1, account2, this.initmoney.toString()],
            };
        } else if (this.sutAdapter.getType() === 'ethereum') {
            args = {
                verb: 'transfer',
                args: [account1, account2, this.initmoney]
            };
        } else {
            args = {
                'verb': 'transfer',
                'account1': account1,
                'account2': account2,
                'money': this.initmoney.toString()
            };
        }

        return this.sutAdapter.invokeSmartContract('simple', 'v0', args, 10);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new Workload();
}

module.exports.createWorkloadModule = createWorkloadModule;
