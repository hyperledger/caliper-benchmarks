package main

import (
	"contracts"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"utils"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Chaincode - chaincode implementation
type Chaincode struct{}

// Init - initialize the chaincode
func (t *Chaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	// do nothing
	return shim.Success([]byte{})
}

// Invoke - route requests
func (t *Chaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	funcName, args := stub.GetFunctionAndParameters()
	funcName = strings.ToLower(funcName)

	fac := new(contracts.FixedAssetContract)
	ctx := utils.NewContext(stub)

	switch funcName {
	case "init":
		fac.Init(ctx)
		return shim.Success(nil)
	case "emptycontract":
		return shim.Success([]byte(fac.EmptyContract(ctx)))
	case "createasset":
		err := fac.CreateAsset(ctx, args[0])

		if err != nil {
			shim.Error(err.Error())
		}

		return shim.Success(nil)
	case "createassetsfrombatch":
		err := fac.CreateAssetsBatch(ctx, args[0])

		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success(nil)
	case "getasset":
		asset, err := fac.GetAsset(ctx, args[0])

		if err != nil {
			return shim.Error(err.Error())
		}

		bytes, err := json.Marshal(asset)

		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success(bytes)
	case "getassetsfrombatch":
		uuids := []string{}

		err := json.Unmarshal([]byte(args[0]), &uuids)

		assets, err := fac.GetAssetsFromBatch(ctx, uuids)

		if err != nil {
			return shim.Error(err.Error())
		}

		bytes, err := json.Marshal(assets)

		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success(bytes)
	case "paginatedrichquery":
		pagesize, err := strconv.ParseInt(args[1], 10, 32)

		if err != nil {
			shim.Error("Page size not valid number")
		}

		results, err := fac.PaginatedRichQuery(ctx, args[0], int32(pagesize), args[2])

		if err != nil {
			return shim.Error(err.Error())
		}

		bytes, err := json.Marshal(results)

		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success(bytes)
	case "paginatedrangequery":
		pagesize, err := strconv.ParseInt(args[2], 10, 32)

		if err != nil {
			shim.Error("Page size not valid number")
		}

		results, err := fac.PaginatedRangeQuery(ctx, args[0], args[1], int32(pagesize), args[3])

		if err != nil {
			return shim.Error(err.Error())
		}

		bytes, err := json.Marshal(results)

		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success(bytes)
	default:
		return shim.Error("No such function " + funcName)
	}
}

func main() {
	err := shim.Start(new(Chaincode))

	if err != nil {
		fmt.Printf("Error starting Fixed asset chaincode - %s", err)
	}
}
