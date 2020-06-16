package main

import (
	"encoding/json"
	"fabric/api/fixed-asset/go/assets"
	"fabric/api/fixed-asset/go/utils"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract implementation
type SmartContract struct {
	contractapi.Contract
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error creating FixedAssetContract: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting FixedAssetContract: %s", err.Error())
	}
}

// Init - placeholder function that isn't need for functionality
func (s *SmartContract) Init(ctx contractapi.TransactionContextInterface) error {
	fmt.Println("Placeholder function")
	return nil
}

// EmptyContract - return a null response
func (s *SmartContract) EmptyContract(ctx contractapi.TransactionContextInterface) error {
	fmt.Println("Returning null response")
	return nil
}

// CreateAsset - create a new FixedAsset in the world state
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, uuid string, fixedAsset assets.FixedAsset) error {
	fmt.Println("Entering createAsset")
	fmt.Println("Inserting asset")

	bytes, _ := json.Marshal(fixedAsset)

	err := ctx.GetStub().PutState(uuid, bytes)

	if err != nil {
		return err
	}

	fmt.Println("Exiting createAsset")

	return nil
}

// CreateAssetsFromBatch - produce assets from an array of content
func (s *SmartContract) CreateAssetsFromBatch(ctx contractapi.TransactionContextInterface, batchArray []assets.FixedAsset) error {
	fmt.Println("Entering createAssetsFromBatch")

	for _, fixedAsset := range batchArray {

		bytes, _ := json.Marshal(fixedAsset)

		err := ctx.GetStub().PutState(fixedAsset.UUID, bytes)

		if err != nil {
			return err
		}
	}

	return nil
}

// GetAsset - get an asset by its uuid
func (s *SmartContract) GetAsset(ctx contractapi.TransactionContextInterface, uuid string) (*assets.FixedAsset, error) {
	fmt.Println("Performing getState for asset with uuid: " + uuid)

	bytes, err := ctx.GetStub().GetState(uuid)

	if err != nil {
		return nil, err
	}

	fixedAsset := new(assets.FixedAsset)

	err = json.Unmarshal(bytes, fixedAsset)

	if err != nil {
		return nil, err
	}

	return fixedAsset, nil
}

// GetAssetsFromBatch - get a group of assets
func (s *SmartContract) GetAssetsFromBatch(ctx contractapi.TransactionContextInterface, batch []string) ([]*assets.FixedAsset, error) {
	fmt.Println("Entering getAssetsFromBatch")

	retArr := make([]*assets.FixedAsset, len(batch))

	for _, uuid := range batch {
		bytes, err := ctx.GetStub().GetState(uuid)

		if err != nil {
			return nil, err
		}

		fixedAsset := new(assets.FixedAsset)

		err = json.Unmarshal(bytes, fixedAsset)

		if err != nil {
			return nil, err
		}

		retArr = append(retArr, fixedAsset)
	}

	return retArr, nil
}

// PaginatedRichQuery - run a paginated rich query
func (s *SmartContract) PaginatedRichQuery(ctx contractapi.TransactionContextInterface, queryString string, pagesize int32, passedBookmark string) (*utils.QueryResponse, error) {
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
func (s *SmartContract) PaginatedRangeQuery(ctx contractapi.TransactionContextInterface, startKey string, endKey string, pagesize int32, passedBookmark string) (*utils.QueryResponse, error) {
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

		fixedAsset := new(assets.FixedAsset)

		err := json.Unmarshal(content, fixedAsset)

		if err != nil {
			return nil, err
		}

		results = append(results, fixedAsset)
	}

	return &results, nil
}
