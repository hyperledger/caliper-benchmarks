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

const OperationBase = require('./utils/operation-base');
const Smallbank = require('./utils/smallbank');

/**
 * Workload module for the benchmark round.
 */
class Modify extends OperationBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
    }

    /**
     * Creates a Smallbank instance initialized for the configured number of accounts.
     * @return {Smallbank} The instance.
     * @protected
     */
    createSmallbank() {
        return new Smallbank(this.accounts);
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const requests = this._generateRequestBatch();
        await this.sutAdapter.sendRequests(requests);
    }

    /**
     * Generates Smallbank workload for the current batch.
     * @returns {object[]} Array of requests settings, one for each operation.
     **/
    _generateRequestBatch() {
        let requestBatch = [];

        for(let i = 0; i < this.txnPerBatch; i++) {
            const operation = Smallbank.getRandomOperationName();
            const operationArgs = this.smallbank.getRandomOperationArguments(operation);
            requestBatch.push(this.createConnectorRequest(operation, operationArgs));
        }

        return requestBatch;
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new Modify();
}

module.exports.createWorkloadModule = createWorkloadModule;
