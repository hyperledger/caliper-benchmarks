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

echo "$ caliper --version"
npx caliper --version

# Set workspace as caliper-benchmarks root
WORKSPACE=$(cd "$(dirname '$1')" &>/dev/null && printf "%s/%s" "$PWD" "${1##*/}")
echo "---- Setting workspace path ${WORKSPACE}"

# Build config for target network
echo "---- Building required crypto configuration"
cd ${WORKSPACE}networks/fabric/config_solo_raft
./generate.sh
cd ${WORKSPACE}

# Nominate a target network (that has above config)
NETWORK=networks/fabric/v2/v2.1.0/2org1peercouchdb_raft/api/fabric-api-solo-node-prometheus.yaml
# Available API benchmarks
BENCHMARK="benchmarks/api/fabric/test.yaml"

# Execute Fabric API benchmarks test
npx caliper launch manager \
--caliper-workspace ${WORKSPACE} \
--caliper-benchconfig ${BENCHMARK} \
--caliper-networkconfig ${NETWORK} \
--caliper-fabric-gateway-enabled \
--caliper-logging-targets "{\"console\": {\"target\": \"console\",\"enabled\": true,\"options\": {\"level\": \"info\"}}}" \
