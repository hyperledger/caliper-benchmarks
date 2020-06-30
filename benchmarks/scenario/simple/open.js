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

const dic = 'abcdefghijklmnopqrstuvwxyz';
let account_array = [];

/**
 * Workload module for the benchmark round.
 */
class Workload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txnPerBatch = 1;
        this.initMoney = 0;
        this.prefix = '';
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

        if(!this.roundArguments.hasOwnProperty('money')) {
            throw new Error('simple.open - \'money\' is missed in the arguments');
        }

        this.initMoney = this.roundArguments.money;
        this.txnPerBatch = this.roundArguments.txnPerBatch || 1;
        this.prefix = this.workerIndex.toString();
    }

    /**
     * Generate string by picking characters from dic variable
     * @param {*} number character to select
     * @returns {String} string generated based on @param number
     */
    _get26Num(number){
        let result = '';
        while(number > 0) {
            result += dic.charAt(number % 26);
            number = Math.floor(number/26);
        }
        return result;
    }

    /**
     * Generate unique account key for the transaction
     * @returns {String} account key
     */
    _generateAccount() {
        return this.prefix + this._get26Num(account_array.length+1);
    }

    /**
     * Generates simple workload
     * @returns {Object} array of json objects
     */
    _generateWorkload() {
        let workload = [];
        for(let i= 0; i < this.txnPerBatch; i++) {
            let acc_id = this._generateAccount();
            account_array.push(acc_id);

            if (this.sutAdapter.getType() === 'fabric') {
                workload.push({
                    chaincodeFunction: 'open',
                    chaincodeArguments: [acc_id, this.initMoney.toString()],
                });
            } else if (this.sutAdapter.getType() === 'ethereum') {
                workload.push({
                    verb: 'open',
                    args: [acc_id, this.initMoney]
                });
            } else {
                workload.push({
                    'verb': 'open',
                    'account': acc_id,
                    'money': this.initMoney
                });
            }
        }
        return workload;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let args = this._generateWorkload();
        return this.sutAdapter.invokeSmartContract(this.sutContext, 'simple', 'v0', args, 100);
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
module.exports.account_array = account_array;
