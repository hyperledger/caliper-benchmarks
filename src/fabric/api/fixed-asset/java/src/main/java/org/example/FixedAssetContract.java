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
     * Placeholder for function that isnt needed functionally
    */
    @Transaction()
    public void init(Context ctx) {
        logger.info("Placeholder function");
    }

    /**
     * Return a null response
     * @param ctx the transaction context
     * @return a null response
     */
    @Transaction()
    public String emptyContract(Context ctx) {
        logger.info("Returning null response");
        return "{}";
    }

    /**
     * Return a null response
     * @param ctx - the transaction context
     * @param content - the content to persist
     */
    @Transaction()
    public void createAsset(Context ctx, String content) {
        logger.info("Entering createAsset");
        logger.info("Inserting asset: " + content);

        JSONObject jsonContent = new JSONObject(content);
        FixedAsset asset = new FixedAsset();
        asset.setUuid(jsonContent.getString("uuid"));
        asset.setCreator(jsonContent.getString("creator"));
        asset.setBytesize(jsonContent.getInt("bytesize"));
        asset.setContent(jsonContent.getString("content"));

        ctx.getStub().putState(asset.getUuid(), asset.toJSONString().getBytes(UTF_8));

        logger.info("Exiting createAsset");
    }

    /**
     * Create a set of Assets in the registry based on the body that is provided to the form
     * [{
     *   uuid: unique identifier
     *   creator: the creator
     *   bytesize: target bytesize of asset
     *   content: variable content
     * }, ...]
     * @param ctx the context
     * @param batch the batch content to persist within an array
     */
    @Transaction()
    public void createAssetsFromBatch(Context ctx, String[] batch) {
        logger.info("Entering createAssetsFromBatch");

        for (String content : batch) {
            JSONObject jsonContent = new JSONObject(content);
            FixedAsset asset = new FixedAsset();
            asset.setUuid(jsonContent.getString("uuid"));
            asset.setCreator(jsonContent.getString("creator"));
            asset.setBytesize(jsonContent.getInt("bytesize"));
            asset.setContent(jsonContent.getString("content"));
            ctx.getStub().putState(asset.getUuid(), asset.toJSONString().getBytes(UTF_8));
        }
        logger.info("Exiting createAssetsFromBatch");
    }

    @Transaction(submit=false)
    public FixedAsset getAsset(Context ctx, String uuid) {
        logger.info("Performing getState for asset with uuid: " + uuid);
        return FixedAsset.fromJSONString(new String(ctx.getStub().getState(uuid), UTF_8));
    }

    @Transaction(submit=false)
    public FixedAsset[] getAssetsFromBatch(Context ctx, String batch) {
        logger.info("Entering getAssetsFromBatch");
        JSONArray jsonBatch = new JSONArray(batch);

        FixedAsset[] items = new FixedAsset[jsonBatch.length()];

        int count = 0;
        for (Object uuid : jsonBatch) {
            String strUuid = (String) uuid;
            FixedAsset asset = FixedAsset.fromJSONString(new String(ctx.getStub().getState(strUuid), UTF_8));
            items[count] = asset;
            count++;
        }
        return items;
    }

    /**
     * Run a paginated rich query
     * @param ctx - the transaction context
     * @param queryString - the query to run
     * @param pagesize - the pagesize to return
     * @param passedBookmark - the bookmark from which to start the return
     * @return the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<FixedAsset> paginatedRichQuery(Context ctx, String queryString, String pagesize, String passedBookmark) {
        logger.info("Entering paginated rich query with pagesize [" + pagesize + "] abd query string: " + queryString);
        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getQueryResultWithPagination(queryString, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<FixedAsset> results = this.getAllResults(iterator);

        QueryResponse<FixedAsset> response = new QueryResponse<FixedAsset>(results.toArray(new FixedAsset[results.size()]), new ResponseMetadata(metadata));
        return response;
    }

    /**
     * Run a paginated range query on the DB contents
     * @param ctx - the transaction context
     * @param startKey - the first key in the range of interest
     * @param endKey - the end key in the range of interest
     * @param pagesize- the end key in the range of interest
     * @param passedBookmark - the bookmark from which to start the return
     * @return the results of the paginated query and responseMetadata in a JSON object
     */
    @Transaction(submit=false)
    public QueryResponse<FixedAsset> paginatedRangeQuery(Context ctx, String startKey, String endKey, String pagesize, String passedBookmark) {
        logger.info("Entering paginated range query with pagesize [" + pagesize + "] and limit keys [" + startKey + "," + endKey + "]");

        int pageSize = Integer.parseInt(pagesize);

        final QueryResultsIteratorWithMetadata<KeyValue> iterator = ctx.getStub().getStateByRangeWithPagination(startKey, endKey, pageSize, passedBookmark);
        QueryResponseMetadata metadata = iterator.getMetadata();
        ArrayList<FixedAsset> results = this.getAllResults(iterator);

        QueryResponse<FixedAsset> response = new QueryResponse<FixedAsset>(results.toArray(new FixedAsset[results.size()]), new ResponseMetadata(metadata));
        return response;
    }

    private ArrayList<FixedAsset> getAllResults(QueryResultsIteratorWithMetadata<KeyValue> iterator) {
        final ArrayList<FixedAsset> results = new ArrayList<FixedAsset>();
        for (KeyValue value : iterator) {
            final String data = value.getStringValue();
            final FixedAsset asset = FixedAsset.fromJSONString(data);
            results.add(asset);
        }

        return results;
    }
}
