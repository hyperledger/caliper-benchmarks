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

CC_SRC_PATH=$1
CC_SRC_LANGUAGE=$1
if [ "$CC_SRC_LANGUAGE" == "node" ]; then
  CC_SRC_LANGUAGE=javascript
fi

case $2 in
  fabcar)
    ./network.sh deployCC -ccn fabcar -ccp ../../caliper-benchmarks/src/fabric/samples/fabcar/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ;;
  marbles)
    ./network.sh deployCC -ccn marbles -ccp ../../caliper-benchmarks/src/fabric/samples/marbles/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ./network.sh deployCC -ccn marbles-norichquery -ccp ../../caliper-benchmarks/src/fabric/samples/marbles-norichquery/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ;;
  simple)
    ./network.sh deployCC -ccn simple -ccp ../../caliper-benchmarks/src/fabric/scenario/simple/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ;;
  smallbank)
    ./network.sh deployCC -ccn smallbank -ccp ../../caliper-benchmarks/src/fabric/scenario/smallbank/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ;;
  fixed-asset)
    ./network.sh deployCC -ccn fixed-asset -ccp ../../caliper-benchmarks/src/fabric/api/fixed-asset/$CC_SRC_PATH -ccl $CC_SRC_LANGUAGE
    ;;
esac
