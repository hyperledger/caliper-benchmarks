/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.example;

import static java.nio.charset.StandardCharsets.UTF_8;

import java.util.ArrayList;

import org.hyperledger.fabric.Logger;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.protos.peer.ChaincodeShim.QueryResponseMetadata;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIteratorWithMetadata;
import org.json.JSONArray;
import org.json.JSONObject;

@Contract(name = "FixedAssetContract",
    info = @Info(title = "FixedAsset contract",
                description = "Fixed Asset Smart Contract",
                version = "0.0.1",
                license =
                        @License(name = "Apache-2.0",
                                url = ""),
                                contact =  @Contact(email = "fixed-asset@example.com",
                                                name = "fixed-asset",
                                                url = "http://somecontract.me")))
@Default
public class FixedAssetContract implements ContractInterface {
    private Logger logger = Logger.getLogger(FixedAssetContract.class);

    public  FixedAssetContract() {

    }

    /**
     * Placeholder for function that isn't needed functionally
    */
    @Transaction()
    public void init(Context ctx) {
        logger.debug("Placeholder function");
    }

    /**
     * Return a null response
     * @param ctx the transaction context
     * @return a null response
     */
    @Transaction()
    public String emptyContract(Context ctx) {
        logger.debug("Entering emptyContract");
        logger.debug("Returning null response");
        return "{}";
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
     * @param ctx - the transaction context
     * @param content - the content to persist
     */
    @Transaction()
    public void createAsset(Context ctx, String uuid, String content) {
        logger.debug("Entering createAsset");
        ctx.getStub().putState(uuid, content.getBytes(UTF_8));
        logger.debug("Exiting createAsset");
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
     * @param ctx - the transaction context
     * @param content - the content to persist
     */
    @Transaction()
    public void createAssetObject(Context ctx, FixedAsset asset) {
        logger.debug("Entering createAssetObject");
        ctx.getStub().putState(asset.getUuid(), asset.toJSONString().getBytes(UTF_8));
        logger.debug("Exiting createAssetObject");
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided to the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }, ...]
     * @param ctx the context
     * @param batch the batch content to persist within an array
     */
    @Transaction()
    public void createAssetsFromBatch(Context ctx, String[] batch) {
        logger.debug("Entering createAssetsFromBatch");

        for (String content : batch) {
            JSONObject jsonContent = new JSONObject(content);
            ctx.getStub().putState(jsonContent.getString("uuid"), jsonContent.toString().getBytes(UTF_8));
        }
        logger.debug("Exiting createAssetsFromBatch");
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided to the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   byteSize: target byteSize of asset
     *   content: variable content
     * }, ...]
     * - Relies on chaincode to form the object for us
     * @param ctx the context
     * @param batch the batch content to persist within an array
     */
    @Transaction()
    public void createAssetObjectsFromBatch(Context ctx, FixedAsset[] batch) {
        logger.debug("Entering createAssetsFromBatch");

        for (FixedAsset asset : batch) {
            ctx.getStub().putState(asset.getUuid(), asset.toJSONString().getBytes(UTF_8));
        }
        logger.debug("Exiting createAssetsFromBatch");
    }

    /**
     * Get an Asset from the registry that was created by createAsset
     * - directly returns the string
     * @param ctx - the transaction context
     * @param uuid - the uuid of the asset to retrieve
     * @return a string asset that may be parsed into an object
     */
    @Transaction(submit=false)
    public String getAsset(Context ctx, String uuid) {
        logger.debug("Entering getAsset");
        logger.debug("Performing getState for asset with uuid: " + uuid);
        return new String(ctx.getStub().getState(uuid), UTF_8);
    }

    /**
     * Get an Asset from the registry that was created by createAsset
     * - casts to a FixedAsset object
     * @param ctx - the transaction context
     * @param uuid - the uuid of the asset to retrieve
     * @return a concrete FixedAsset
     */
    @Transaction(submit=false)
    public FixedAsset getAssetObject(Context ctx, String uuid) {
        logger.debug("Entering getAssetObject");
        logger.debug("Performing getState for asset with uuid: " + uuid);
        return FixedAsset.fromJSONString(new String(ctx.getStub().getState(uuid), UTF_8));
    }

    /**
     * Get all Assets from the registry using a passed array of UUIDs
     * @param {Context} ctx the context
     * @param {String} batch the array containing all UUIDs to query
     * @return the result of the query
     * */
    @Transaction(submit=false)
    public String[] getAssetsFromBatch(Context ctx, String batch) {
        logger.debug("Entering getAssetsFromBatch");
        JSONArray jsonBatch = new JSONArray(batch);

        String[] items = new String[jsonBatch.length()];

        int count = 0;
        for (Object uuid : jsonBatch) {
            String strUuid = (String) uuid;
            String asset = new String(ctx.getStub().getState(strUuid), UTF_8);
            items[count] = asset;
            count++;
        }
        logger.debug("Exiting getAssetsFromBatch, returning result set of size: " + items.length);
        return items;
    }

    /**
     * Get all Assets from the registry using a passed array of UUIDs
     * @param {Context} ctx the context
     * @param {String} batch the array containing all UUIDs to query
     * @return the result of the query
     * */
    @Transaction(submit=false)
    public FixedAsset[] getAssetObjectsFromBatch(Context ctx, String batch) {
        logger.debug("Entering getAssetObjectsFromBatch");
        JSONArray jsonBatch = new JSONArray(batch);

        FixedAsset[] items = new FixedAsset[jsonBatch.length()];

        int count = 0;
        for (Object uuid : jsonBatch) {
            String strUuid = (String) uuid;
            FixedAsset asset = FixedAsset.fromJSONString(new String(ctx.getStub().getState(strUuid), UTF_8));
            items[count] = asset;
            count++;
        }
        logger.debug("Exiting getAssetObjectsFromBatch, returning result set of size: " + items.length);
        return items;
    }

    /**
     * Run a paginated rich query
     * @param ctx - the transaction context
     * @param queryString - the query to run
     * @param pagesize - the pagesize to return
     * @param passedBookmark - the bookmark from which to start the return
     * @return QueryResponse<String> the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<String> paginatedRichQuery(Context ctx, String queryString, String pagesize, String passedBookmark) {
        logger.debug("Entering paginatedRichQuery with pagesize [" + pagesize + "] and query string: " + queryString);
        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getQueryResultWithPagination(queryString, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<String> results = this.getAllResults(iterator);

        QueryResponse<String> response = new QueryResponse<String>(results.toArray(new String[results.size()]), new ResponseMetadata(metadata));
        logger.debug("Exiting paginatedRichQuery with response: " + response.toString());
        return response;
    }

    /**
     * Run a paginated rich query
     * @param ctx - the transaction context
     * @param queryString - the query to run
     * @param pagesize - the pagesize to return
     * @param passedBookmark - the bookmark from which to start the return
     * @return QueryResponse<FixedAsset> the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<FixedAsset> paginatedObjectRichQuery(Context ctx, String queryString, String pagesize, String passedBookmark) {
        logger.debug("Entering paginatedObjectRichQuery with pagesize [" + pagesize + "] and query string: " + queryString);
        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getQueryResultWithPagination(queryString, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<FixedAsset> results = this.getAllObjectResults(iterator);

        QueryResponse<FixedAsset> response = new QueryResponse<FixedAsset>(results.toArray(new FixedAsset[results.size()]), new ResponseMetadata(metadata));
        logger.debug("Exiting paginatedObjectRichQuery with response: " + response.toString());
        return response;
    }

    /**
     * Run a paginated range query on the DB contents
     * @param ctx - the transaction context
     * @param startKey - the first key in the range of interest
     * @param endKey - the end key in the range of interest
     * @param pagesize- the end key in the range of interest
     * @param passedBookmark - the bookmark from which to start the return
     * @return QueryResponse<String> the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<String> paginatedRangeQuery(Context ctx, String startKey, String endKey, String pagesize, String passedBookmark) {
        logger.debug("Entering paginatedRangeQuery with pagesize [" + pagesize + "] and limit keys [" + startKey + "," + endKey + "]");

        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getStateByRangeWithPagination(startKey, endKey, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<String> results = this.getAllResults(iterator);

        QueryResponse<String> response = new QueryResponse<String>(results.toArray(new String[results.size()]), new ResponseMetadata(metadata));
        logger.debug("Exiting paginatedRangeQuery with response: " + response.toString());
        return response;
    }

    /**
     * Run a paginated range query on the DB contents
     * @param ctx - the transaction context
     * @param startKey - the first key in the range of interest
     * @param endKey - the end key in the range of interest
     * @param pagesize- the end key in the range of interest
     * @param passedBookmark - the bookmark from which to start the return
     * @return QueryResponse<FixedAsset> the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<FixedAsset> paginatedObjectRangeQuery(Context ctx, String startKey, String endKey, String pagesize, String passedBookmark) {
        logger.debug("Entering paginatedObjectRangeQuery with pagesize [" + pagesize + "] and limit keys [" + startKey + "," + endKey + "]");

        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getStateByRangeWithPagination(startKey, endKey, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<FixedAsset> results = this.getAllObjectResults(iterator);

        QueryResponse<FixedAsset> response = new QueryResponse<FixedAsset>(results.toArray(new FixedAsset[results.size()]), new ResponseMetadata(metadata));
        logger.debug("Exiting paginatedObjectRangeQuery with response: " + response.toString());
        return response;
    }

    private ArrayList<String> getAllResults(QueryResultsIteratorWithMetadata<KeyValue> iterator) {
        final ArrayList<String> results = new ArrayList<String>();
        for (KeyValue value : iterator) {
            final String data = value.getStringValue();
            results.add(data);
        }

        return results;
    }

    private ArrayList<FixedAsset> getAllObjectResults(QueryResultsIteratorWithMetadata<KeyValue> iterator) {
        final ArrayList<FixedAsset> results = new ArrayList<FixedAsset>();
        for (KeyValue value : iterator) {
            final String data = value.getStringValue();
            final FixedAsset asset = FixedAsset.fromJSONString(data);
            results.add(asset);
        }

        return results;
    }
}
