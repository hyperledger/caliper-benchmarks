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
class TransferWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.index = 0;
        this.accountList = [];
        this.txnPerBatch = 1;
    }

    /**
     * Generates simple workload
     * @return {Object} array of json objects
     */
    _generateWorkload() {
        let workload = [];
        for (let i = 0; i < this.txnPerBatch; i++) {
            let fromIndex = this.index % this.accountList.length;
            let toIndex = (this.index + Math.floor(this.accountList.length / 2)) % this.accountList.length;
            let value = Math.floor(Math.random() * 100);
            let args = {
                contractId: 'parallelok',
                args: {
                    transaction_type: 'transfer(string,string,uint256)',
                    from: this.accountList[fromIndex].accountID,
                    to: this.accountList[toIndex].accountID,
                    num: value
                }
            };
            workload.push(args);

            this.index++;
            this.accountList[fromIndex].balance -= value;
            this.accountList[toIndex].balance += value;
        }
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

        this.txnPerBatch = this.roundArguments.txnPerBatch || 1;

        const addUser = require('./addUser');
        this.accountList = addUser.accountList;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const workload = this._generateWorkload();
        await this.sutAdapter.sendRequests(workload);
    }

    async cleanupWorkloadModule() {
        console.info('Start balance validation ...');
        let correctAcccountNum = this.accountList.length;
        for (let i = 0; i < this.accountList.length; ++i) {
            let account = this.accountList[i];
            let accountID = account.accountID;
            let balance = account.balance;
            const queryArgs = {
                contractId: 'parallelok',
                args: {
                    transaction_type: 'balanceOf(string)',
                    name: accountID
                },
                readOnly: true
            };
            let state = await this.sutAdapter.sendRequests(queryArgs);
            let remoteBalance = state.status.result.result.output;
            remoteBalance = parseInt(remoteBalance, 16);
            if (remoteBalance !== balance) {
                console.error(`Abnormal account state: AccountID=${accountID}, LocalBalance=${balance}, RemoteBalance=${remoteBalance}`);
                correctAcccountNum--;
            }
        }

        if (correctAcccountNum === this.accountList.length) {
            console.info('Balance validation succeeded');
        }
        else {
            throw new Error(`Balance validation failed: success=${correctAcccountNum}, fail=${this.accountList.length - correctAcccountNum}`);
        }
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new TransferWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
