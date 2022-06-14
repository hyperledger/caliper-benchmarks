/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const bytes = (s) => {
    return ~-encodeURI(s).split(/%..|./).length;
};

const writeOptions = {
    read: 'read',
    notRead: 'notRead',
    random: 'random',
  };

const helper = require('../helper');
const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class CompositeTxWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.chaincodeID = '';
        this.byteSize = 0;
        this.readSize = 0;
        this.writeSize = 0;
        this.previouslyRead = writeOptions.random; //use enum to say the mode(include random)
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
        const assetNumber = args.assets ? parseInt(args.assets) : 2
        this.assetsPerWorker = Math.floor(assetNumber / totalWorkers);
        if (this.workerIndex == 0){
            const reminder = assetNumber % totalWorkers;
            this.assetsPerWorker += reminder;
        } 

        this.byteSize = args.byteSize;
        this.readSize = args.read ? parseInt(args.read) : 1;//TODO throw error or utput the facttha it defaulted to 1
        this.writeSize = args.write.number ? parseInt(args.write.number) : 1;//TODO throw error or utput the facttha it defaulted to 1
        this.previouslyRead = args.write.previouslyRead in writeOptions ? args.write.previouslyRead : writeOptions.random;

        this.asset = {
            docType: this.chaincodeID,
            content: '',
            creator: 'client' + this.workerIndex,
            byteSize: this.byteSize
        };

        const paddingSize = this.byteSize - bytes(JSON.stringify(this.asset));
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

        const totalRandomIds = this.readSize + this.writeSize;
        const ids = helper.retrieveRandomAssetIdsFromRange(totalRandomIds, 0, this.assetsPerWorker);

        for (let i = 0; i < this.readSize; i++) {
            // pick one of the randomized items and remove it from future consideration
            const uuid = ids.shift(); 
            const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + uuid;
            readKeys.push(key);
        }

        for(let i = 0; i < this.writeSize; i++){
            if(i < readKeys.length && this.previouslyRead == writeOptions.read){ //previosly read keys write
                writeKeys.push(readKeys[i]);
            } else if (this.previouslyRead == writeOptions.random){ //random keys write
                const uuid = Math.floor(Math.random() * this.assetsPerWorker);
                const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + uuid;
                writeKeys.push(key);
            } else { //not already read keys write
                const uuid = ids.shift();
                const key = 'client' + this.workerIndex + '_' + this.byteSize + '_' + uuid;
                writeKeys.push(key);
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
    return new CompositeTxWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
