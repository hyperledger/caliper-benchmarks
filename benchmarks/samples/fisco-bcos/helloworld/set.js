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
class SetWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txnPerBatch = 1;
    }

    /**
     * Generates simple workload
     * @return {Object} array of json objects
     */
    _generateWorkload() {
        let workload = [];
        for (let i = 0; i < this.txnPerBatch; i++) {
            let w = {
                'transaction_type': 'set(string)',
                'name': 'hello! - from ' + this.workerIndex.toString(),
            };
            workload.push(w);
        }
        return workload;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let args = this._generateWorkload();
        return this.sutAdapter.invokeSmartContract('helloworld', 'v0', args, null);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new SetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
