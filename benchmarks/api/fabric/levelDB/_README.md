node ./scripts/main.js -c ./benchmark/network-model/levelDB/base.yaml -n ./network/fabric-v1.4/2org1peergoleveldb/fabric-node.json
node ./scripts/main.js -c ./benchmark/network-model/levelDB/get-asset-ramp.yaml -n ./network/fabric-v1.4/2org1peergoleveldb/fabric-node.json 
node ./scripts/main.js -c ./benchmark/network-model/levelDB/create-asset-size-ramp.yaml -n ./network/fabric-v1.4/2org1peergoleveldb/fabric-node.json
node ./scripts/main.js -c ./benchmark/network-model/levelDB/range-query-ramp.yaml -n ./network/fabric-v1.4/2org1peergoleveldb/fabric-node.json 