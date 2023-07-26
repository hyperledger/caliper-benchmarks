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




// const type = ['EMSTOP', 'SERSTOP', 'RUN', 'RESET', 'FAULT'];
// const description = ['Emergency Stop Button', 'Service Stop Button', 'Run Button Pressed', 'Reset Button Pressed', 'Technical Fault Detected In The System'];

/**
 * Workload module for the benchmark round.
 */
class CreateEventWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.type = ['EMSTOP', 'SERSTOP', 'RUN', 'RESET', 'FAULT'];
        this.description = ['Emergency Stop Button', 'Service Stop Button', 'Run Button Pressed', 'Reset Button Pressed', 'Technical Fault Detected In The System'];
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
    }

    async submitTransaction() {
        this.txIndex++;

        let docType = 'event' + this.workerIndex + this.txIndex.toString();
        const event_id = 'event-ID' + `${this.roundIndex}_${this.workerIndex}_${this.txIndex}_${Date.now()}`;
        let event_type = this.type[Math.floor(Math.random() * this.type.length)];
        let event_description = this.description[Math.floor(Math.random() * this.description.length)];
        let event_start = 'event-started_' + this.workerIndex + this.txIndex.toString();
        let event_ends   = 'event-ended_' + this.workerIndex + this.txIndex.toString();

        const request = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'CreateEvent',
            invokerIdentity: 'User1',
            contractArguments: [docType, event_id, event_type, event_description, event_start, event_ends],
            readOnly: false
        };

        console.info(this.txIndex);
        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new CreateEventWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
