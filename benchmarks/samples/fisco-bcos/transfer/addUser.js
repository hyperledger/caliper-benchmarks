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

let accountList = [];
const initMoney = 100000000;

/**
 * Workload module for the benchmark round.
 */
class AddUserWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.prefix = '';
    }

    /**
     * Generate unique account key for the transaction
     * @param {Number} index account index
     * @returns {String} account key
     */
    _generateAccount(index) {
        return this.prefix + index.toString();
    }

    /**
     * Generates simple workload
     * @returns {Object} array of json objects
     */
    _generateWorkload() {
        let workload = [];
        let index = accountList.length;
        let accountID = this._generateAccount(index);
        accountList.push({
            'accountID': accountID,
            'balance': initMoney
        });

        workload.push({
            contractId: 'parallelok',
            args: {
                transaction_type: 'set(string,uint256)',
                name: accountID,
                num: initMoney
            }
        });
        return workload;
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {ConnectorBase} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        this.prefix = this.workerIndex.toString();

        const args = {
            contractId: 'parallelok',
            args: {
                transaction_type: 'enableParallel()'
            }
        };

        // Enable parallel transaction executor first, this transaction should *NOT* be recorded by context
        await this.sutAdapter.sendRequests(args);
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const args = this._generateWorkload();
        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new AddUserWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
module.exports.accountList = accountList;
