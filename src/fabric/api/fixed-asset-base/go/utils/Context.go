package utils

import "github.com/hyperledger/fabric-chaincode-go/shim"

// Context - simple context object
type Context struct {
	stub shim.ChaincodeStubInterface
}

// GetStub - return the chaincode stub
func (ctx *Context) GetStub() shim.ChaincodeStubInterface {
	return ctx.stub
}

// NewContext - create new context
func NewContext(stub shim.ChaincodeStubInterface) Context {
	return Context{stub}
}
