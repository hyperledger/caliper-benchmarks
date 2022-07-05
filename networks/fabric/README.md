# Fabric Networks

Ensure you have all the necessary prerequisites for [Caliper](https://github.com/hyperledger/caliper/) and [Hyperledger Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

## Fabric Samples Test Network

Hyperledger Fabric provides a test network as part of its samples. This test network is a good generalised network that you can used to get started.

Steps to setup an environment to use caliper-benchmarks with Fabric samples test-network

- create a directory for this environment - eg `mkdir fabric-benchmarks`
- change to this directory - eg `cd fabric-benchmarks`
- follow the steps to install that latest version of fabric samples and docker images [install fabric](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)
- clone caliper-benchmarks (ensure it is created inside the directory you created above)

```bash
git clone https://github.com/hyperledger/caliper-benchmarks
```

- change into the caliper-benchmarks directoy

```bash
cd caliper-benchmarks
```

- install the latest version of caliper

```bash
npm install --only=prod @hyperledger/caliper-cli
```

- bind to the fabric

To bind with fabric 2.2 (which uses the legacy node-sdk 2.2) which can be used with a Fabric 2.2 or higher SUT run:
```bash
npx caliper bind --caliper-bind-sut fabric:2.2
```

To bind with fabric 2.4 and utilise the new peer-gateway service introduced in fabric 2.4 run:
```bash
npx caliper bind --caliper-bind-sut fabric:2.4
```

If you wish to change the version of binding make sure to unbind your current binding (for example if you bound to fabric:2.2 unbind first with `caliper unbind --caliper-bind-sut fabric:2.2`) before binding to the new one.

- change to the fabric-samples/test-network directory `cd ../fabric-samples/test-network directory`
- bring up test network with a channel called `mychannel`

```bash
./network.sh up createChannel -s couchdb
```

This will create a fabric network using `couchdb` as the state database because some of the chaincodes use rich queries. If you want to test with `leveldb` you can drop the `-s couchdb` option but make sure the chaincode you deploy doesn't require it.
The test-network caliper configuration file is coded to work with cryptogen generated material so do not start test-network using fabric-cas for the generated keys and certificates (ie don't use the `-ca` option).

To terminate the network use the `./network.sh down` command

Now you are ready to choose a chaincode to deploy and run some benchmarks. There are some pre-requisites for test-network

1. For Go chaincode deployment you will need GoLang installed and it needs to be an appropriate version to support the version of fabric you are using, currently tested with GoLang 16.7
2. For Java chaincode deployment you will need Java JDK 8 installed

The network configuration file provided by this repo for test-network called `networks/fabric/test-network.yaml` is configured to support all the chaincodes listed in this README. It also looks for certificates created using cryptogen by test-network, which is the default when starting test-network and is reflected in the commands provided in this README.

### Fabcar

Fabcar has chaincode for Go, Java, Javascript. It doesn't make use of rich queries so can be used with a `leveldb` based fabric network rather than `couchdb`

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory

##### To deploy the Go version

```bash
./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/go -ccl go
```

##### To deploy the Java version

```bash
./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/java -ccl java
```

##### To deploy the Javascript version

```bash
./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/node -ccl javascript
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/fabcar/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```

### Marbles

Marbles comes in both rich query and no rich query flavours and has has chaincode for Go and Javascript.

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory

##### To deploy the Go with rich queries version

```bash
./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/go -ccl go
```

##### To deploy the Go without rich queries version

```bash
./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/go -ccl go
```

##### To deploy the Javascript with rich queries version

```bash
./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/node -ccl javascript
```

##### To deploy the Javascript without rich queries version

```bash
./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/node -ccl javascript
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/marbles/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```

### Simple

Simple has chaincode for Go, Javascript. It doesn't make use of rich queries so can be used with a `leveldb` based fabric network rather than `couchdb`

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory

##### To deploy the Go version

```bash
./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/go -ccl go
```

##### To deploy the Javascript version

```bash
./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/node -ccl javascript
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/simple/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```

### Smallbank

Smallbank has chaincode for Go only. It doesn't make use of rich queries so can be used with a `leveldb` based fabric network rather than `couchdb`

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory

##### To deploy the Go version

```bash
./network.sh deployCC -ccn smallbank -ccp ../../caliper-benchmarks/src/fabric/scenario/smallbank/go -ccl go
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory first

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/smallbank/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```

### fixed-asset

This is a complete set of benchmarks for hyperledger fabric focusing on managing a simple asset. The chaincodes are written to use the Hyperledger fabric contract api and are available for Go, Java and Javascript. These chaincodes require `couchdb` as they perform rich queries.

The benchmarks require a Prometheus server to be running that is collecting Hyperledger Fabric metrics. the Fabric Samples provide a test Prometheus and Grafana server for test-network. To start this environment:

- Ensure your test network is up
- in the `test-network` directory change to the `prometheus-grafana` directory
- `docker-compose up -d` to bring up the servers

You can terminate the servers with the command `docker-compose down`.

There are several benchmarks available within the `benchmarks/api/fabric` directory to choose from and each file contains a description of their purpose

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory

##### To deploy the Go version

```bash
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/go -ccl go -cccg ../../caliper-benchmarks/src/fabric/api/fixed-asset/collections-config.json
```

##### To deploy the Java version

```bash
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/java -ccl java -cccg ../../caliper-benchmarks/src/fabric/api/fixed-asset/collections-config.json
```

##### To deploy the Javascript version

```bash
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/node -ccl javascript -cccg ../../caliper-benchmarks/src/fabric/api/fixed-asset/collections-config.json
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory. As there a several benchmarks to choose from the example below just shows the `get-asset.yaml` benchmark invocation

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/api/fabric/get-asset.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```
### fixed-asset-base

fixed-asset-base is equivalent to fixed-asset but instead it doesn't make use of the contract-api. It also doesn't provide a java chaincode version. Refer back to the fixed-asset section for more details

#### Chaincode deployment

Ensure you are in the `fabric-samples/test-network` directory. Note here that we deploy with a chaincode ID of `fixed-asset` not `fixed-asset-base`.

##### To deploy the Go version

```bash
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/go -ccl go -cccg ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/collections-config.json
```

##### To deploy the Javascript version

```bash
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/node -ccl javascript -cccg ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/collections-config.json
```

#### Benchmark execution

Ensure you are in the `caliper-benchmarks` directory. As there a several benchmarks to choose from the example below just shows the `get-asset.yaml` benchmark invocation

```bash
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/api/fabric/get-asset.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```
