npm install --only=prod @hyperledger/caliper-cli@unstable
npx caliper bind --caliper-bind-sut fabric:1.4

# Set workspace as caliper-benchmarks root
WORKSPACE=$(cd "$(dirname '$1')/../../.." &>/dev/null && printf "%s/%s" "$PWD" "${1##*/}")
# Nominate a target network
NETWORK=networks/fabric/v2/v2.1.0/2org1peercouchdb_raft/api/fabric-api-solo-node.yaml

# Enable tests to use existing caliper-core package
#export NODE_PATH=$(which node)

# Build config for target network
cd ${WORKSPACE}networks/fabric/config_solo_raft
./generate.sh
cd ${WORKSPACE}

# Available benchmarks
BENCHMARK="benchmarks/api/fabric/test.yaml"
# Available phases
PHASES=("caliper-flow-only-start" "caliper-flow-only-init" "caliper-flow-only-install" "caliper-flow-only-test" "caliper-flow-only-end")

# Execute Phases
function runBenchmark () {
    PHASE=$1
    npx caliper launch manager \
    --caliper-workspace ${WORKSPACE} \
    --caliper-benchconfig ${BENCHMARK} \
    --caliper-networkconfig ${NETWORK} \
    --caliper-fabric-gateway-enabled \
    --${PHASE}

    sleep 5s
} 

# Repeat for PHASES
for PHASE in ${PHASES[@]}; do	
    runBenchmark ${PHASE}
done