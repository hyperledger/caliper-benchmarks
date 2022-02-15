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

# Install the latest version of Caliper
echo "Installing Caliper"
npm install --only=prod @hyperledger/caliper-cli
npx caliper bind --caliper-bind-sut fabric:2.2
npx caliper --version

# Install latest fabric test network
pushd ..
echo "Installing fabric samples"
curl -sSL https://bit.ly/2ysbOFE | bash -s

# Start test-network
echo "starting test-network, prometheus and grafana"
cd fabric-samples/test-network
./network.sh up createChannel -s couchdb
cd prometheus-grafana
docker-compose up -d
cd ..

# Deploy all fabric chaincodes. This tests that the Go and Java ones at least compile
# But doesn't really test the node ones
# Also to be able to run benchmarks the chaincode name must match the entry in test-network.yaml

#
# fabcar
# 
echo "deploying fabcar chaincodes"
./network.sh deployCC -ccn fabcar-go -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/go -ccl go
# ./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/java -ccl java
# rename javascript to node
./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/javascript -ccl javascript

#
# marbles
#
echo "deploying marbles chaincodes"
# ./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/go -ccl go
./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/node -ccl javascript

#
# marbles-norichquery
#
# This one can't be benchmarked as it needs to be deployed as marbles
echo "deploying marbles-norichquery chaincodes"
# ./network.sh deployCC -ccn marbles-norichquery -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/go -ccl go
./network.sh deployCC -ccn marbles-norichquery -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/node -ccl javascript

#
# simple
#
echo "deploying simple"
# ./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/go -ccl go
./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/node -ccl javascript

#
# smallbank
# 
echo "deploying smallbank"
# ./network.sh deployCC -ccn smallbank -ccp ../../caliper-benchmarks/src/fabric/scenario/smallbank/go -ccl go

#
# fixed-asset
#
echo "deploying fixed-asset"
# ./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/go -ccl go
# ./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/java -ccl java
./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/node -ccl javascript


#
# fixed-asset-base
#
# This one can't be benchmarked as it needs to be deployed as fixed-asset
echo "deploying fixed-asset-base"
# ./network.sh deployCC -ccn fixed-asset-base -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/go -ccl go
./network.sh deployCC -ccn fixed-asset-base -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset-base/node -ccl javascript


# now we need to run some benchmarks
popd

# benchmark chaincodes whose ccn is: fabcar, marbles, simple, fixed-asset
# echo "Running fabcar benchmarks"
# npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/fabcar/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
echo "Running marbles benchmarks"
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/samples/fabric/marbles/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
echo "Running simple benchmarks"
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/simple/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
# echo "Running smallbank benchmarks"
# npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/scenario/smallbank/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
echo "Running fixed-asset benchmarks"
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/api/fabric/test.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled