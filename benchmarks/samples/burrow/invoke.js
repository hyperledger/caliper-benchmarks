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
class InvokeWorkload extends WorkloadModuleBase {
    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let args = [{
            verb:'invoke',
            funName: 'setInt',
            funArgs: [1000]
        }];
        return this.sutAdapter.invokeSmartContract(this.sutContext, 'SimpleStorage', 'v0', args, 10);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new InvokeWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
