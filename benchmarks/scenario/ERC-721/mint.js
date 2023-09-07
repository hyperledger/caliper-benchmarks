'use strict';

const OperationBase = require('./utils/operation-base');
const SimpleState = require('./utils/simple-state');

class Mint extends OperationBase {
    constructor() {
        super();
    }

    createSimpleState() {
        const accountsPerWorker = this.numberOfAccounts / this.totalWorkers;
        return new SimpleState(this.workerIndex, this.tokenId, accountsPerWorker);
    }

    async submitTransaction() {
        const mintArgs = this.simpleState.getMintArguments();
        await this.sutAdapter.sendRequests(this.createConnectorRequest('mint', mintArgs));
    }
}

function createWorkloadModule() {
    return new Mint();
}

module.exports.createWorkloadModule = createWorkloadModule;