package contracts

import (
	"encoding/json"
	"fabric/api/fixed-asset-base/go/assets"
	"fabric/api/fixed-asset-base/go/utils"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
)

// FixedAssetContract - managed fixed assets
type FixedAssetContract struct{}

// Init - placeholder function that isn't need for functionality
func (contract *FixedAssetContract) Init(ctx utils.Context) {
	fmt.Println("Placeholder function")
}

// EmptyContract - return a null response
func (contract *FixedAssetContract) EmptyContract(ctx utils.Context) string {
	fmt.Println("Returning null response")

	return "{}"
}

// CreateAsset - create a new FixedAsset in the world state
func (contract *FixedAssetContract) CreateAsset(ctx utils.Context, content string) error {
	fmt.Println("Entering createAsset")
	fmt.Println("Inserting asset")

	fixedAsset := assets.FixedAsset{}

	err := json.Unmarshal([]byte(content), &fixedAsset)

	if err != nil {
		return err
	}

	bytes, _ := json.Marshal(fixedAsset)

	err = ctx.GetStub().PutState(fixedAsset.UUID, bytes)

	if err != nil {
		return err
	}

	fmt.Println("Exiting createAsset")

	return nil
}

// CreateAssetsBatch - produce assets from an array of content
func (contract *FixedAssetContract) CreateAssetsBatch(ctx utils.Context, batch string) error {
	fmt.Println("Entering createAssetsFromBatch")

	batchArray := []assets.FixedAsset{}
	err := json.Unmarshal([]byte(batch), &batchArray)

	if err != nil {
		return err
	}

	for _, fixedAsset := range batchArray {

		bytes, _ := json.Marshal(fixedAsset)

		err = ctx.GetStub().PutState(fixedAsset.UUID, bytes)

		if err != nil {
			return err
		}
	}

	return nil
}

// GetAsset - get an asset by its uuid
func (contract *FixedAssetContract) GetAsset(ctx utils.Context, uuid string) (*assets.FixedAsset, error) {
	fmt.Println("Performing getState for asset with uuid: " + uuid)

	bytes, err := ctx.GetStub().GetState(uuid)

	if err != nil {
		return nil, err
	}

	fixedAsset := assets.FixedAsset{}

	err = json.Unmarshal(bytes, &fixedAsset)

	if err != nil {
		return nil, err
	}

	return &fixedAsset, nil
}

// GetAssetsFromBatch - get a group of assets
func (contract *FixedAssetContract) GetAssetsFromBatch(ctx utils.Context, batch []string) (*[]*assets.FixedAsset, error) {
	fmt.Println("Entering getAssetsFromBatch")

	retArr := make([]*assets.FixedAsset, len(batch))

	for idx, uuid := range batch {
		bytes, err := ctx.GetStub().GetState(uuid)

		if err != nil {
			return nil, err
		}

		fixedAsset := assets.FixedAsset{}

		err = json.Unmarshal(bytes, &fixedAsset)

		if err != nil {
			return nil, err
		}

		retArr[idx] = &fixedAsset
	}

	return &retArr, nil
}

// PaginatedRichQuery - run a paginated rich query
func (contract *FixedAssetContract) PaginatedRichQuery(ctx utils.Context, queryString string, pagesize int32, passedBookmark string) (*utils.QueryResponse, error) {
	fmt.Printf("Entering paginated rich query with pagesize [%d] and query string: %s", pagesize, queryString)

	iterator, metadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pagesize, passedBookmark)

	if err != nil {
		return nil, err
	}

	results, err := getAllResults(iterator)

	if err != nil {
		return nil, err
	}

	respMetadata := utils.ResponseMetadata{
		RecordsCount: metadata.GetFetchedRecordsCount(),
		Bookmark:     metadata.GetBookmark(),
	}

	return &utils.QueryResponse{
		Results:          results,
		ResponseMetadata: respMetadata,
	}, nil
}

// PaginatedRangeQuery - run a paginated range query
func (contract *FixedAssetContract) PaginatedRangeQuery(ctx utils.Context, startKey string, endKey string, pagesize int32, passedBookmark string) (*utils.QueryResponse, error) {
	fmt.Printf("Entering paginated range query with pagesize [%d] and limit keys [%s ,%s]", pagesize, startKey, endKey)
	iterator, metadata, err := ctx.GetStub().GetStateByRangeWithPagination(startKey, endKey, pagesize, passedBookmark)

	if err != nil {
		return nil, err
	}

	results, err := getAllResults(iterator)

	if err != nil {
		return nil, err
	}

	respMetadata := utils.ResponseMetadata{
		RecordsCount: metadata.GetFetchedRecordsCount(),
		Bookmark:     metadata.GetBookmark(),
	}

	return &utils.QueryResponse{
		Results:          results,
		ResponseMetadata: respMetadata,
	}, nil
}

func getAllResults(iterator shim.StateQueryIteratorInterface) (*[]*assets.FixedAsset, error) {

	results := []*assets.FixedAsset{}

	for iterator.HasNext() {
		keyValue, _ := iterator.Next()

		content := keyValue.GetValue()

		fixedAsset := assets.FixedAsset{}

		err := json.Unmarshal(content, &fixedAsset)

		if err != nil {
			return nil, err
		}

		results = append(results, &fixedAsset)
	}

	return &results, nil
}
