/*
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-console */

'use strict';

const { Contract } = require('fabric-contract-api');

const logLevel = process.env.CORE_CHAINCODE_LOGGING_LEVEL;
const isVerbose = (logLevel && (logLevel.toUpperCase() === 'INFO' || logLevel.toUpperCase() === 'DEBUG' ));

const collection = "CollectionOne";

/**
 * Simple chaincode to create an asset that may have a user provided body
 */
class Asset extends Contract {

    /**
     * Placeholder for function that isn't needed functionally
     */
    async init(){

    }

    /**
     * Return a null response
     * @returns {null}  a null response
     */
    async emptyContract() {
        if (isVerbose) {
            console.log('Entering emptyContract');
            console.log('Returning null response');
        }

        return {};
    }

    /**
     * Create an Asset in the registry based on the body that is provided of the form
     * {
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }
     * Directly writes the string content against the passed uuid
     * @param {Context} ctx the context
     * @param {number} uuid the uuid to persist the body under
     * @param {String} content the content to persist
     */
    async createAsset(ctx, uuid, content) {
        if (isVerbose) {
            console.log('Entering createAsset');
        }
        await ctx.stub.putState(uuid, Buffer.from(content));
        if (isVerbose) {
            console.log('Exiting createAsset');
        }
    }

    /**
     * Create an Asset in the private data store based on the transient data that is provided of the form
     * {
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }
     *
     * Writes transient data against the passed uuid
     * @param {Context} ctx the context
     * @param {number} uuid the uuid to persist the body under
     */
    async createPrivateAsset(ctx, uuid) {
        if (isVerbose) {
            console.log('Entering createPrivateAsset');
        }
        const privateAsset = {};
        const transientData = ctx.stub.getTransient();
        privateAsset.content = transientData.get('content').toString('utf8');

        await ctx.stub.putPrivateData(collection, uuid, Buffer.from(JSON.stringify(privateAsset)));

        if (isVerbose) {
            console.log('Exiting createPrivateAsset');
        }
    }

    /**
     * Create an Asset in the registry based on the body that is provided of the form
     * {
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }
     * The body is parsed to include a step where the body is an object
     * @param {Context} ctx the context
     * @param {String} content the content to persist
     */
    async createAssetObject(ctx, content) {
        if (isVerbose) {
            console.log('Entering createAssetObject');
        }
        const jsnContent = JSON.parse(content);
        await ctx.stub.putState(jsnContent.uuid, Buffer.from(JSON.stringify(jsnContent)));
        if (isVerbose) {
            console.log('Exiting createAssetObject')
        };
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided of the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }, ...]
     * @param {Context} ctx the context
     * @param {String} batch the content to persist within an array
     */
    async createAssetsFromBatch(ctx, batch) {
        if (isVerbose) {
            console.log('Entering createAssetsFromBatch');
        }

        const jasonContent = JSON.parse(batch);
        for (let i in jasonContent) {
            const asset = jasonContent[i];
            await ctx.stub.putState(asset.uuid, Buffer.from(JSON.stringify(asset)));
        }

        if (isVerbose) {
            console.log('Exiting createAssetsFromBatch');
        }
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided of the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }, ...]
     * @param {Context} ctx the context
     * @param {String} batch the content to persist within an array
     */
    async createPrivateAssetsFromBatch(ctx, batch_size) {

        if (isVerbose) {
            console.log('Entering createPrivateAssetsFromBatch');
        }

        const transientContent = ctx.stub.getTransient().get('content');
        const transientData = JSON.parse(transientContent);

        for (let i=0; i<batch_size; i++) {
            let privateAsset = {};

            for (let j in transientData) {
                privateAsset.content = transientData[j];
                await ctx.stub.putPrivateData(collection, transientData[j].uuid, JSON.stringify(privateAsset));
            }
        }

        if (isVerbose) {
            console.log('Exiting createPrivateAssetsFromBatch');
        }
    }

    /**
     * Get an Asset from the registry that was created by createAsset
     * - directly returns the string
     * @param {Context} ctx the context
     * @param {String} uuid the uuid to query
     * @returns the result of the query
     */
    async getAsset(ctx, uuid) {
        if (isVerbose) {
            console.log('Entering getAsset');
        }
        const assetAsBytes =  await ctx.stub.getState(uuid);
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`Asset with uuid ${uuid} was not successfully retrieved`);
        } else {
            if (isVerbose) {
                console.log(`Returning result for getAsset with uuid: ${uuid}`);
            }
            return assetAsBytes;
        }
    }

    /**
     * Get an Asset from the registry that was created by createPrivateAsset
     * - directly returns the string
     * @param {Context} ctx the context
     * @param {String} uuid the uuid to query
     * @returns the result of the query
     */
    async getPrivateAsset(ctx, uuid) {
        if (isVerbose) {
            console.log('Entering getPrivateAsset');
        }
        const privateAssetAsBytes =  await ctx.stub.getPrivateData(collection, uuid);
        if (!privateAssetAsBytes || privateAssetAsBytes.length === 0) {
            throw new Error(`Private asset with uuid ${uuid} was not successfully retrieved`);
        } else {
            if (isVerbose) {
                console.log(`Returning result for getPrivateAsset with uuid: ${uuid}`);
            }
            return privateAssetAsBytes;
        }
    }

    /**
     * Get all Assets from the registry using a passed array of UUIDs
     * @param {Context} ctx the context
     * @param {String} batch the array containing all UUIDs to query
     * @returns the result of the query
     */
    async getAssetsFromBatch(ctx, batch) {
        if (isVerbose) {
            console.log('Entering getAssetsFromBatch');
        }
        const items = [];
        const uuids = JSON.parse(batch);
        for (const uuid of uuids) {
            const assetAsBytes = await ctx.stub.getState(uuid);
            if (!assetAsBytes || assetAsBytes.length === 0) {
                throw new Error(`Asset with uuid ${uuid} was not successfully retrieved`);
            } else {
                items.push(assetAsBytes);
            }
        }
        if (isVerbose) {
            console.log(`Exiting getAssetsFromBatch(), returning result set of size: ${items.length}`);
        }
        return items;
    }

    /**
     * Delete an Asset from the registry that was created by createAsset
     * @param {Context} ctx the context
     * @param {String} uuid the uuid to query
     * @returns the result of the delete
     */
    async deleteAsset(ctx, uuid) {
        if (isVerbose) {
            console.log('Entering deleteAsset');
            console.log(`Returning result for deleteAsset with uuid: ${uuid}`);
        }
        return await ctx.stub.deleteState(uuid);
    }

    /**
     * Delete a batch of assets from the registry
     * @param {Context} ctx the context
     * @param {String} batch the array containing all UUIDs to query
     */
    async deleteAssetsFromBatch(ctx, batch) {
        if (isVerbose) {
            console.log('Entering deleteAssetsFromBatch');
        }
        const uuids = JSON.parse(batch);
        for (let i in uuids) {
            const uuid = uuids[i];
            await ctx.stub.deleteState(uuid);
        }
        if (isVerbose) {
            console.log(`Exiting deleteAssetsFromBatch`);
        }
    }

    /**
     * Do y read and x write
     * @param {Context} ctx the context
     * @param {String} readIds the uuid to query
     * @param {String} writeIds the uuid to write to
     * @param {String} letter letter to use as base to produce content of assetsto write
     */
     async readWriteAssets(ctx, readIds, writeIds, letter) {
        if (isVerbose) {
            console.log('Entering ReadWriteAssets');
        }

        let fixedAssetBytes;
        const readIDs = JSON.parse(readIds);
        for (const id of readIDs) {
            const assetAsBytes = await ctx.stub.getState(id);

            if (!assetAsBytes || assetAsBytes.length === 0) {
                throw new Error(`Asset with id ${id} does not exist`);
            }

            fixedAssetBytes = assetAsBytes;
        }

        const fixedAsset = JSON.parse(fixedAssetBytes);
        const maxPaddingSize = fixedAsset.content.length + fixedAsset.uuid.length

        const keysToWrite = JSON.parse(writeIds);
        for (const id of keysToWrite) {
	    // changing the id is likely to change the size of the asset
            // so padding size needs to be adjusted accordingly
            fixedAsset.content = letter.repeat(maxPaddingSize - id.length);
            fixedAsset.uuid = id;
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(fixedAsset)));
        }

        if (isVerbose) {
            console.log('Exiting ReadWriteAssets');
        }
    }

    /**
     * Run a paginated rich query
     * @param {Object} ctx - the transaction context
     * @param {String} queryString - the query to run
     * @param {String} pagesize - the pagesize to return
     * @param {String} bookmark - the bookmark from which to start the return
     * @returns {JSON} the results of the paginated query and responseMetadata in a JSON object
     */
    async paginatedRichQuery(ctx, queryString, pagesize,  bookmark) {
        if (isVerbose) {
            console.log(`Entering paginated rich query with pagesize [${pagesize}] and query string: ${queryString}`);
        }
        const response = {};
        const pageSize = parseInt(pagesize, 10);

        if (bookmark.length > 0) {
            const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
            response.results = await this._getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        } else {

            const { iterator, metadata } = await ctx.stub.getQueryResultWithPagination(queryString, pageSize);
            response.results = await this._getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        }
        if (isVerbose) {
            console.log(`Exiting paginatedRichQuery with response: ${JSON.stringify(response)}`);
        }
        return response;
    }

    /**
     * Run a paginated range query on the DB contents
     * @param {Object} ctx - the transaction context
     * @param {String} startKey - the first key in the range of interest
     * @param {String} endKey - the end key in the range of interest
     * @param {String} pagesize - the pagesize to return
     * @param {String} bookmark - the bookmark from which to start the return
     * @returns {JSON} the results of the paginated query and responseMetadata in a JSON object
     */
    async paginatedRangeQuery(ctx, startKey, endKey, pagesize, bookmark) {
        if (isVerbose) {
            console.log(`Entering paginatedRangeQuery with pagesize [${pagesize}] and limit keys: [${startKey},${endKey}]`);
        }
        const response = {};
        const pageSize = parseInt(pagesize, 10);

        if (bookmark.length > 0) {
            const { iterator, metadata } = await ctx.stub.getStateByRangeWithPagination(startKey,endKey, pageSize, bookmark);
            response.results = await this._getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        } else {
            const { iterator, metadata } = await ctx.stub.getStateByRangeWithPagination(startKey,endKey, pageSize);
            response.results = await this._getAllResults(iterator);
            response.responseMetadata = {
                RecordsCount: metadata.fetched_records_count,
                Bookmark: metadata.bookmark,
            };
        }
        if (isVerbose) {
            console.log(`Exiting paginatedRangeQuery with response: ${JSON.stringify(response)}`);
        }
        return response;
    }

    /**
     * Get all results present in the iterator
     * @param {Object} iterator the iterator to retrieve results from
     * @returns {String[]} all results
     * @private
     * @async
     */
    async _getAllResults(iterator) {
        let allResults = [];
        let res = await iterator.next();
        let iterate = res.value ? true: false;
        while (iterate) {
            if (res.value && res.value.value.toString()) {
                let jsonRes;
                try {
                    jsonRes = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
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
}

module.exports = Asset;
