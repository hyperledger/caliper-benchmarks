node ./scripts/main.js -c ./benchmark/network-model/couchDB/base.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json 
node ./scripts/main.js -c ./benchmark/network-model/couchDB/get-asset.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json 
node ./scripts/main.js -c ./benchmark/network-model/couchDB/create-asset.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json 
node ./scripts/main.js -c ./benchmark/network-model/couchDB/range-query.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json
node ./scripts/main.js -c ./benchmark/network-model/couchDB/mixed-paginated-range-query.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json 
node ./scripts/main.js -c ./benchmark/network-model/couchDB/rich-query-asset.yaml -n ./network/fabric-v1.4/2org1peercouchdb/fabric-node.json 