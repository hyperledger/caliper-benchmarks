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
class Create extends OperationBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
    }

    /**
     * Create a Smallbank instance with no accounts.
     * @return {Smallbank} The instance.
     * @protected
     */
    createSmallbank() {
        return new Smallbank();
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const createArgs = this.smallbank.getCreateAccountArguments();
        const request = this.createConnectorRequest('create_account', createArgs);
        await this.sutAdapter.sendRequests(request);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new Create();
}

module.exports.createWorkloadModule = createWorkloadModule;
