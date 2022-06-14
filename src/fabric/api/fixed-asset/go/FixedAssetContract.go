package main

import (
	"encoding/json"
	"fabric/api/fixed-asset/go/assets"
	"fabric/api/fixed-asset/go/utils"
	"fmt"
	"strings"
	"unsafe"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const collection = "CollectionOne"

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
		fmt.Println("Error performing PutState: " + err.Error())
		return err
	}

	fmt.Println("Exiting createAsset")

	return nil
}

// CreatePrivateAsset - create a new FixedAsset in the world state
func (s *SmartContract) CreatePrivateAsset(ctx contractapi.TransactionContextInterface, uuid string) error {
	fmt.Println("Entering createPrivateAsset")
	fmt.Println("Inserting asset")

	// Get new asset from transient map
	transientMap, err := ctx.GetStub().GetTransient()

	if err != nil {
		return fmt.Errorf("error getting transient: %v", err)
	}

	transientAssetJSONBytes, ok := transientMap["content"]

	if !ok {
		//log error to stdout
		return fmt.Errorf("asset not found in the transient map input")
	}

	var fixedAsset assets.FixedAsset
	err = json.Unmarshal(transientAssetJSONBytes, &fixedAsset)

	if err != nil {
		return fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	err = ctx.GetStub().PutPrivateData(collection, uuid, transientAssetJSONBytes)

	if err != nil {
		return err
	}

	fmt.Println("Exiting createPrivateAsset")

	return nil
}

// CreateAssetsFromBatch - produce assets from an array of content
func (s *SmartContract) CreateAssetsFromBatch(ctx contractapi.TransactionContextInterface, batchArray []assets.FixedAsset) error {
	fmt.Println("Entering createAssetsFromBatch")

	for _, fixedAsset := range batchArray {

		bytes, _ := json.Marshal(fixedAsset)

		err := ctx.GetStub().PutState(fixedAsset.UUID, bytes)

		if err != nil {
			fmt.Println("Error performing PutState: " + err.Error())
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
		fmt.Println("Error performing GetState: " + err.Error())
		return nil, err
	}

	fixedAsset := new(assets.FixedAsset)

	err = json.Unmarshal(bytes, fixedAsset)

	if err != nil {
		fmt.Println("Error performing json.Unmarshal: " + err.Error())
		fmt.Println("Error performing json.Unmarshal on bytes: " + string(bytes[:]))
		return nil, err
	}

	return fixedAsset, nil
}

// GetPrivateAsset - get an asset by its uuid
func (s *SmartContract) GetPrivateAsset(ctx contractapi.TransactionContextInterface, uuid string) (*assets.FixedAsset, error) {
	fmt.Println("Performing getPrivateData for asset with uuid: " + uuid)

	bytes, err := ctx.GetStub().GetPrivateData(collection, uuid)

	if err != nil {
		fmt.Println("Error performing ctx.GetStub.GetPrivateData(): " + err.Error())
		return nil, err
	}

	fixedAsset := new(assets.FixedAsset)

	err = json.Unmarshal(bytes, fixedAsset)
	if err == nil {
		return fixedAsset, nil
	}

	// Workaround until a) fix node chaincode and/or go cc can create private assets in batch
	nodeCreatedFixedAsset := new(assets.PrivateAssetContent)

	err = json.Unmarshal(bytes, nodeCreatedFixedAsset)
	if err == nil {
		return &nodeCreatedFixedAsset.Content, nil
	}

	fmt.Println("Error performing json.Unmarshal: " + err.Error())
	fmt.Println("Error performing json.Unmarshal on bytes: " + string(bytes[:]))
	return nil, err

}

// GetAssetsFromBatch - get a group of assets
func (s *SmartContract) GetAssetsFromBatch(ctx contractapi.TransactionContextInterface, batch []string) ([]*assets.FixedAsset, error) {
	fmt.Println("Entering getAssetsFromBatch")

	retArr := make([]*assets.FixedAsset, len(batch))

	for _, uuid := range batch {
		bytes, err := ctx.GetStub().GetState(uuid)

		if err != nil {
			fmt.Println("Error performing GetState: " + err.Error())
			return nil, err
		}

		fixedAsset := new(assets.FixedAsset)

		err = json.Unmarshal(bytes, fixedAsset)

		if err != nil {
			fmt.Println("Error performing json.Unmarshal: " + err.Error())
			fmt.Println("Error performing json.Unmarshal on bytes: " + string(bytes[:]))
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
		fmt.Println("Error performing GetQueryResultWithPagination: " + err.Error())
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
		fmt.Println("Error performing GetStateByRangeWithPagination: " + err.Error())
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

//Do y read and x write - directly returns the string
func (s *SmartContract) readWriteAssets(ctx contractapi.TransactionContextInterface, readUuids []string, writeUiids []string, letter string) ([]*assets.FixedAsset, error) {
	fmt.Println("Entering compositeTx()")

	retArr := make([]*assets.FixedAsset, len(readUuids))

	for _, uuid := range readUuids {
		bytes, err := ctx.GetStub().GetState(uuid)

		if err != nil {
			fmt.Println("Error performing GetState: " + err.Error())
			return nil, err
		}

		fixedAsset := new(assets.FixedAsset)

		err = json.Unmarshal(bytes, fixedAsset)

		if err != nil {
			fmt.Println("Error performing json.Unmarshal: " + err.Error())
			fmt.Println("Error performing json.Unmarshal on bytes: " + string(bytes[:]))
			return nil, err
		}

		retArr = append(retArr, fixedAsset)
	}

	assetTemplate := new(assets.FixedAsset)
	byteSize := assetTemplate.Bytesize
	for _, uuid := range writeUiids {
		assetTemplate.UUID = uuid
		paddingSize := byteSize - int(unsafe.Sizeof(assetTemplate))
		assetTemplate.Content = strings.Repeat(letter, paddingSize)
		bytes, _ := json.Marshal(assetTemplate)
		ctx.GetStub().PutState(uuid, bytes)
	}

	fmt.Println(`Exiting compositeTx(), returning result set of size: ${items.length}`)

	return retArr, nil
}

func getAllResults(iterator shim.StateQueryIteratorInterface) (*[]*assets.FixedAsset, error) {

	results := []*assets.FixedAsset{}

	for iterator.HasNext() {
		keyValue, _ := iterator.Next()

		content := keyValue.GetValue()

		fixedAsset := new(assets.FixedAsset)

		err := json.Unmarshal(content, fixedAsset)

		if err != nil {
			fmt.Println("Error performing json.Unmarshal: " + err.Error())
			fmt.Println("Error performing json.Unmarshal on content: " + string(content[:]))
			return nil, err
		}

		results = append(results, fixedAsset)
	}

	return &results, nil
}
