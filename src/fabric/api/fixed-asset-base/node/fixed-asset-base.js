/*
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-console */

'use strict';

const shim = require('fabric-shim');

const logLevel = process.env.CORE_CHAINCODE_LOGGING_LEVEL;
const isVerbose = (logLevel && (logLevel.toUpperCase() === 'INFO' || logLevel.toUpperCase() === 'DEBUG' ));

/**
 * Simple chaincode to create an asset that may have a user provided body
 */
const FixedAssetBase = class {

    /**
     * Placeholder for function that isn't needed functionally
     */
    async Init(stub) {
        console.info('=========== Instantiated fixed-asset-base chaincode ===========');
        return shim.success();
    }

    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();

        if (isVerbose) {
            console.info(ret);
        }

        let method = this[ret.fcn];
        if (!method) {
            console.error('no function of name:' + ret.fcn + ' found');
            throw new Error('Received unknown function ' + ret.fcn + ' invocation');
        }
        try {
            let payload = await method(stub, ret.params);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }
    }
    
    /**
     * Return a null response
     * @param {*} stub 
     * @param {*} args 
     */
    async emptyContract(stub, args) {
        if (isVerbose) {
            console.log('Entering emptyContract');
            console.log('Returning null response');
        }
    }

    /**
     * Create an Asset in the registry based on the body that is provided of the form
     * {
     *   uuid: unique identifier
     *   creator: the creator
     *   bytesize: target bytesize of asset
     *   content: variable content
     * }
     * Directly writes the string content against the passed uuid
     * @param {*} stub 
     * @param {*} args 
     */
    async createAsset(stub, args) {
        const uuid = args[0];
        const content = args[1];
        if (isVerbose) {
            console.log('Entering createAsset');
        }        
        await stub.putState(uuid, Buffer.from(content));
        if (isVerbose) {
            console.log('Exiting createAsset');
        }
    }

    /**
     * Create an Asset in the registry based on the body that is provided of the form
     * {
     *   uuid: unique identifier
     *   creator: the creator
     *   bytesize: target bytesize of asset
     *   content: variable content
     * }
     * The body is parsed to include a step where the body is an object
     * @param {*} stub 
     * @param {*} args 
     */
    async createAssetObject(stub, args) {
        if (isVerbose) {
            console.log('Entering createAssetObject');
        }
        const jsnContent = JSON.parse(args[0]);
        await stub.putState(jsnContent.uuid, Buffer.from(JSON.stringify(jsnContent)));
        if (isVerbose) {
            console.log('Exiting createAssetObject')
        };
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided of the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   bytesize: target bytesize of asset
     *   content: variable content
     * }, ...]
     * @param {*} stub 
     * @param {*} args 
     */
    async createAssetsFromBatch(stub, args) {
        if (isVerbose) {
            console.log('Entering createAssetsFromBatch');
        }

        const jasonContent = JSON.parse(args[0]);
        for (let i in jasonContent) {
            const asset = jasonContent[i];
            await stub.putState(asset.uuid, Buffer.from(JSON.stringify(asset)));
        }

        if (isVerbose) {
            console.log('Exiting createAssetsFromBatch');
        }
    }

    /**
     * Get an Asset from the registry that was created by createAsset
     * - directly returns the string
     * @param {*} stub 
     * @param {*} args 
     * @returns the result of the query
     */
    async getAsset(stub, args) {
        if (isVerbose) {
            console.log('Entering getAsset');
            console.log(`Returning result for getAsset with uuid: ${args[0]}`);
        }
        return await stub.getState(args[0]);
    }

    /**
     * Get an Asset from the registry that was created by createAsset
     * -includes a parse stage to enable cast of the object
     * @param {*} stub 
     * @param {*} args 
     * @returns the result of the query
     */
    async getAssetObject(stub, args) {
        if (isVerbose) {
            console.log('Entering getAssetObject');
        }
        const assetAsBytes =  await stub.getState(args[0]);
        if (isVerbose) {
            const asset = JSON.parse(assetAsBytes.toString());
            console.log(`Exiting getAssetObject, returning asset with uuid: ${asset.uuid}`);
        }
        return assetAsBytes;
    }

    /**
     * Get all Assets from the registry using a passed array of UUIDs
     * @param {*} stub 
     * @param {*} args 
     * @returns the result of the query
     */
    async getAssetsFromBatch(stub, args) {
        if (isVerbose) {
            console.log('Entering getAssetsFromBatch()');
        }
        const items = [];
        const uuids = JSON.parse(args[0]);
        for (let i in uuids) {
            const uuid = uuids[i];
            const item = await stub.getState(uuid);
            items.push(item);
        }
        if (isVerbose) {
            console.log(`Exiting getAssetsFromBatch(), returning result set of size: ${items.length}`);
        }
        return Buffer.from(JSON.stringify(items));
    }

    /**
     * Delete an Asset from the registry that was created by createAsset
     * @param {*} stub 
     * @param {*} args 
     * @returns the result of the delete
     */
    async deleteAsset(stub, args) {
        if (isVerbose) {
            console.log('Entering deleteAsset');
            console.log(`Returning result for deleteAsset with uuid: ${args[0]}`);
        }
        return await stub.deleteState(args[0]);
    }

    /**
     * Get all Assets from the registry using a passed array of UUIDs
     * @param {*} stub 
     * @param {*} args 
     * @returns the result of the query
     */
    async deleteAssetsFromBatch(stub, args) {
        if (isVerbose) {
            console.log('Entering deleteAssetsFromBatch()');
        }
        const uuids = JSON.parse(args[0]).uuids;
        for (let i in uuids) {
            const uuid = uuids[i];
            console.log(`deleting UUID ${uuid}`);
            await stub.deleteState(uuid);
        }
        if (isVerbose) {
            console.log(`Exiting deleteAssetsFromBatch()`);
        }
    }

    /**
     * Run a paginated rich query
     * @param {*} stub 
     * @param {*} args 
     * @returns {JSON} the results of the paginated query and responseMetadata in a JSON object
     */
    async paginatedRichQuery(stub, args) {
        const queryString = args[0];
        const pagesize = args[1];
        const bookmark = args[2];
        if (isVerbose) {
            console.log(`Entering paginated rich query with pagesize [${pagesize}] and query string: ${queryString}`);
        }
        const response = {};
        const pageSize = parseInt(pagesize, 10);

        if (bookmark.length > 0) {
            const { iterator, metadata } = await stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
            response.results = await this.getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        } else {
            
            const { iterator, metadata } = await stub.getQueryResultWithPagination(queryString, pageSize);
            response.results = await this.getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        }
        if (isVerbose) {
            console.log(`Exiting paginatedRichQuery with response: ${JSON.stringify(response)}`);
        }
        return Buffer.from(JSON.stringify(response));
    }

    /**
     * Get all results present in the iterator
     * @param {Object} iterator the iterator to retrieve results from
     * @returns {String[]} all results
     */
    async getAllResults(iterator) {
        let allResults = [];
        let res = await iterator.next();
        let iterate = res.value ? true: false;
        while (iterate) {
            if (res.value && res.value.value.toString()) {
                let jsonRes;
                try {
                    jsonRes = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.err(err);
                    jsonRes = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if(res.done){
                iterate = false;
            } else {
                res = await iterator.next();
            }
        }
        await iterator.close();
        return allResults;
    }

    /**
     * Run a paginated range query on the DB contents
     * @param {*} stub 
     * @param {*} args 
     * startKey - the first key in the range of interest
     * endKey - the end key in the range of interest
     * pagesize - the pagesize to return
     * bookmark - the bookmark from which to start the return
     * @returns {JSON} the results of the paginated query and responseMetadata in a JSON object
     */
    async paginatedRangeQuery(stub, args) {
        const startKey = args[0];
        const endKey = args[1];
        const pagesize = args[2];
        const bookmark = args[3];
        if (isVerbose) {
            console.log(`Entering paginatedRangeQuery with pagesize [${pagesize}] and limit keys: [${startKey},${endKey}]`);
        }
        const response = {};
        const pageSize = parseInt(pagesize, 10);

        if (bookmark.length > 0) {
            const { iterator, metadata } = await stub.getStateByRangeWithPagination(startKey,endKey, pageSize, bookmark);
            response.results = await this.getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        } else {
            const { iterator, metadata } = await stub.getStateByRangeWithPagination(startKey,endKey, pageSize);
            response.results = await this.getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        }
        if (isVerbose) {
            console.log(`Exiting paginatedRangeQuery with response: ${JSON.stringify(response)}`);
        }
        Buffer.from(JSON.stringify(response));
    }
}

shim.start(new FixedAssetBase());