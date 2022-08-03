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

case $1 in
  fabcar)
    export BENCHCONFIG=benchmarks/samples/fabric/fabcar/config.yaml
    ;;
  marbles)
    export BENCHCONFIG=benchmarks/samples/fabric/marbles/config.yaml
    ;;
  simple)
    export BENCHCONFIG=benchmarks/scenario/simple/config.yaml
    ;;
  smallbank)
    export BENCHCONFIG=benchmarks/scenario/smallbank/config.yaml
    ;;
  fixed-asset)
    export BENCHCONFIG=benchmarks/api/fabric/test.yaml
    ;;
esac

npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig $BENCHCONFIG --caliper-flow-only-test --caliper-fabric-gateway-enabled
