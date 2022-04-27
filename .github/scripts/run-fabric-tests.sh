#!/bin/bash
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Exit on first error, print all commands.
set -e
set -o pipefail

# assume we are in the benchmarks directory
echo ${PWD}

CC_SRC_PATH=$1
CC_SRC_LANGUAGE=$1
if [ "$CC_SRC_LANGUAGE" == "node" ]; then
  CC_SRC_LANGUAGE=javascript
fi

echo "---- Running tests for $CC_SRC_PATH"

# Install the latest version of Caliper
echo "---- Installing Caliper"
npm install --only=prod @hyperledger/caliper-cli
npx caliper bind --caliper-bind-sut fabric:2.2
npx caliper --version

# Install latest fabric test network
pushd ..
echo "---- Installing fabric samples"
curl -sSL https://bit.ly/2ysbOFE | bash -s

# Start test-network
echo "---- Starting test-network, prometheus and grafana"
cd fabric-samples/test-network
./network.sh up createChannel -s couchdb
cd prometheus-grafana
docker-compose up -d
cd ..

# Deploy all fabric chaincodes. This tests that the Go and Java ones at least compile, but only tests
# that npm install can be done for node.
# To be able to run benchmarks the chaincode name must match the entry in test-network.yaml
# In this case we ensure the node ones are enabled. In the future we might create a matrix of go/java/node
# builds

#
# fabcar
#
echo "---- Deploying fabcar $CC_SRC_PATH chaincode"
./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE

#
# marbles
#
# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Deploying marbles $CC_SRC_PATH chaincode"
  ./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
fi

#
# marbles-norichquery
#
# This one can't be benchmarked as it needs to be deployed as marbles
# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Deploying marbles-norichquery $CC_SRC_PATH chaincode"
  ./network.sh deployCC -ccn marbles-norichquery -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
fi

#
# simple
#
# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Deploying simple $CC_SRC_PATH chaincode"
  ./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
fi

#
# smallbank
#
if [ "$CC_SRC_LANGUAGE" = "go" ]; then
  echo "---- Deploying smallbank $CC_SRC_PATH chaincode"
  ./network.sh deployCC -ccn smallbank -ccp ../../caliper-benchmarks/src/fabric/scenario/smallbank/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
fi

#
# fixed-asset
#
echo "---- Deploying fixed-asset $CC_SRC_PATH chaincode"
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE

#
# fixed-asset-base
#
# This one can't be benchmarked as it needs to be deployed as fixed-asset
# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Deploying fixed-asset-base $CC_SRC_PATH chaincode"
  ./network.sh deployCC -ccn fixed-asset-base -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
fi

echo "---- Displaying containers"
docker ps -a

# now we need to run some benchmarks
popd

# benchmark chaincodes whose ccn is: fabcar, marbles, simple, fixed-asset, smallbank

echo "---- Running fabcar benchmarks"
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/fabcar/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled

# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Running marbles benchmarks"
  npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/marbles/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
fi

# only javascript and go work, java not available.
if [ "$CC_SRC_LANGUAGE" != "java" ]; then
  echo "---- Running simple benchmarks"
  npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/simple/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
fi

# only go works, javascript and java not available.
if [ "$CC_SRC_LANGUAGE" = "go" ]; then
  echo "---- Running smallbank benchmarks"
   npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/smallbank/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
fi

echo "---- Running fixed-asset benchmarks"
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/api/fabric/test.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled

echo "---- Test for $CC_SRC_PATH chaincodes and benchmarks completed successfully"