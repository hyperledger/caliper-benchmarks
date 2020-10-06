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

const colors = ['red', 'blue', 'green', 'black', 'white', 'pink', 'rainbow'];
const owners = ['Alice', 'Bob', 'Claire', 'David'];

/**
 * Workload module for the benchmark round.
 */
class InitWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;
        let marbleName = 'marble_' + this.txIndex.toString() + '_' + this.workerIndex.toString();
        let marbleColor = colors[this.txIndex % colors.length];
        let marbleSize = (((this.txIndex % 10) + 1) * 10).toString(); // [10, 100]
        let marbleOwner = owners[this.txIndex % owners.length];

        const args = {
            contractId: 'marbles',
            contractVersion: 'v1',
            contractFunction: 'initMarble',
            contractArguments: [marbleName, marbleColor, marbleSize, marbleOwner],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new InitWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
