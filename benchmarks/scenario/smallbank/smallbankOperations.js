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

let account_array = [];
const initial_balance = 1000000;
const operation_type = ['transact_savings','deposit_checking','send_payment','write_check', 'amalgamate'];

/**
 * Workload module for the benchmark round.
 */
class QueryWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.no_accounts = 0;
        this.accounts = [];
        this.txnPerBatch = 1;
        this.prefix = '';
    }

    /**
     * Get account index
     * @return {Number} index
     */
    _getAccount() {
        return Math.floor(Math.random()*Math.floor(account_array.length));
    }

    /**
     * Get two accounts
     * @return {Array} index of two accounts
     */
    _get2Accounts() {
        let idx1 = this._getAccount();
        let idx2 = this._getAccount();
        if(idx2 === idx1) {
            idx2 = this._getAccount();
        }
        return [idx1, idx2];
    }

    /**
     * Generate unique account key for the transaction
     * @returns {Number} account key
     **/
    _generateAccount() {
        let count = account_array.length+1;
        let num = this.prefix.toString() + count.toString();
        return parseInt(num);
    }

    /**
     * Generates random string.
     * @returns {string} random string from possible characters
     **/
    _random_string() {
        let text = '';
        const possible = 'ABCDEFGHIJKL MNOPQRSTUVWXYZ abcdefghij klmnopqrstuvwxyz';

        for (let i = 0; i < 12; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    /**
     * Generates small bank workload with specified number of accounts
     * and operations.
     * @returns {Object} array of json objects and each denotes
     * one operations
     **/
    _generateWorkload() {
        let workload = [];
        for(let i= 0; (i < this.txnPerBatch && this.no_accounts < this.accounts); i++,this.no_accounts++) {
            let acc_id = this._generateAccount();
            account_array.push(acc_id);
            let acc = {
                'customer_id': acc_id,
                'customer_name': this._random_string(),
                'initial_checking_balance': initial_balance,
                'initial_savings_balance': initial_balance,
                'transaction_type': 'create_account'
            };
            workload.push(acc);
        }
        for(let j= workload.length; j< this.txnPerBatch; j++) {
            let op_index =  Math.floor(Math.random() * Math.floor(operation_type.length));
            let acc_index = this._getAccount();
            let random_op = operation_type[op_index];
            let random_acc = account_array[acc_index];
            let amount = Math.floor(Math.random() * 200);
            let op_payload;
            switch(random_op) {
                case 'transact_savings': {
                    op_payload = {
                        'amount': amount,
                        'customer_id': random_acc,
                        'transaction_type':random_op
                    };
                    break;
                }
                case 'deposit_checking': {
                    op_payload = {
                        'amount': amount,
                        'customer_id': random_acc,
                        'transaction_type':random_op
                    };
                    break;
                }
                case 'send_payment': {
                    let accounts = this._get2Accounts();
                    op_payload = {
                        'amount': amount,
                        'dest_customer_id': account_array[accounts[0]],
                        'source_customer_id': account_array[accounts[1]],
                        'transaction_type': random_op
                    };
                    break;
                }
                case 'write_check': {
                    op_payload = {
                        'amount': amount,
                        'customer_id': random_acc,
                        'transaction_type':random_op
                    };
                    break;
                }
                case 'amalgamate': {
                    let accounts = this._get2Accounts();
                    op_payload = {
                        'dest_customer_id': account_array[accounts[0]],
                        'source_customer_id': account_array[accounts[1]],
                        'transaction_type': random_op
                    };
                    break;
                }
                default: {
                    throw new Error('Invalid operation!!!');
                }
            }
            workload.push(op_payload);
        }
        return workload;
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
        if(!args.hasOwnProperty('accounts')) {
            throw new Error('smallbank.operations - \'accounts\' is missed in the arguments');
        }
        if(!args.hasOwnProperty('txnPerBatch')) {
            throw new Error('smallbank.operations - \'txnPerBatch\' is missed in the arguments');
        }
        this.accounts = args.accounts;
        if(this.accounts <= 3) {
            throw new Error('smallbank.operations - number accounts should be more than 3');
        }
        this.txnPerBatch = args.txnPerBatch;
        this.prefix = this.workerIndex.toString();
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let args = this._generateWorkload();

        // rearrange arguments for the Fabric adapter
        if (this.sutAdapter.getType() === 'fabric') {
            args = args.map(arg => {
                return {
                    contractFunction: arg.transaction_type,
                    // need to remove the key for the TX type
                    contractArguments: Object.keys(arg).filter(k => k !== 'transaction_type').map(k => arg[k].toString()),
                };
            });
        }

        return this.sutAdapter.invokeSmartContract('smallbank', '1.0', args, 30);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new QueryWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
module.exports.account_array = account_array;
