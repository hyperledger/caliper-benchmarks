/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const writeOptions = {
    allread: 'allread',
    notread: 'notread',
    random: 'random',
};

const helper = require('../helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class ReadWriteAssetsWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.chaincodeID = '';
        this.byteSize = 0;
        this.readCount = 0;
        this.writeCount = 0;
        this.writeMode = writeOptions.random;
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
        this.chaincodeID = args.chaincodeID ? args.chaincodeID : 'fixed-asset';
        this.assetsPerWorker = helper.getAssetsPerWorker(args.assets, this.workerIndex, totalWorkers);
        this.byteSize = args.byteSize;
        this.readCount = args.readCount ? parseInt(args.readCount) : 1;
        this.writeCount = args.write.count ? parseInt(args.write.count) : 1;
        this.writeMode = args.write.writeMode in writeOptions ? args.write.writeMode : writeOptions.random;

        this.asset = {
            docType: this.chaincodeID,
            content: '',
            creator: 'client' + this.workerIndex,
            byteSize: this.byteSize
        };

        const paddingSize = this.byteSize - helper.bytes(JSON.stringify(this.asset));
        this.asset.content = 'B'.repeat(paddingSize);
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        // Create argument array [readKeys, writeKeys, otherArgs(String)]

        const readKeys = [];
        const writeKeys = [];

        const totalRandomIds = this.readCount + this.writeCount;
        const ids = helper.retrieveRandomAssetIdsFromRange(totalRandomIds, 0, this.assetsPerWorker);

        for (let i = 0; i < this.readCount; i++) {
            // pick one of the randomized items and remove it from future consideration
            const id = ids.shift(); 
            const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + id;
            readKeys.push(key);
        }

        for(let i = 0; i < this.writeCount; i++) {
            switch (this.writeMode)  {
                case writeOptions.allread: {
                    if (i < readKeys.length) {
                        writeKeys.push(readKeys[i]);
                    } else {
                        const id = ids.shift();
                        const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + id;
                        writeKeys.push(key);
                    }
                    break;
                }
                case writeOptions.random: {
                    const id = Math.floor(Math.random() * this.assetsPerWorker);
                    const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + id;
                    writeKeys.push(key);
                    break;
                }
                case writeOptions.notread:{
                    const id = ids.shift();
                    const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + id;
                    writeKeys.push(key);
                    break;
                }
                default:
                    throw new Error('Unexpected error, most likely a bug in this code. This line should not be executed');
            }
        }

        //generate random letter to use to populate content in the chaincode
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        const letter =  alphabet[Math.floor(Math.random() * alphabet.length)]
        const args = {
            contractId: this.chaincodeID,
            contractFunction: 'readWriteAssets',
            contractArguments: [JSON.stringify(readKeys), JSON.stringify(writeKeys), letter],
            readOnly: false
        };
    
        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new ReadWriteAssetsWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
