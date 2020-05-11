The batch delete asset benchmark consists of submitting `deleteAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction deletes a set of assets, formed by a randomised selection of available UUIDs, from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 10 test clients. Successive rounds increase the batch size of the assets deleted from the world state database with a fixed asset size of 8Kb.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.42 | 0.28 | 134.8 |
| 10 | 0.95 | 0.66 | 99.0 |
| 20 | 1.25 | 0.80 | 78.6 |
| 30 | 0.58 | 0.57 | 6.5 |
| 40 | 2.38 | 1.30 | 25.7 |
| 50 | 0.74 | 0.64 | 6.5 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.79 | 0.45 | 100.6 |
| 10 | 2.79 | 1.38 | 53.9 |
| 20 | 4.95 | 2.49 | 39.8 |
| 30 | 7.28 | 3.16 | 18.3 |
| 40 | 9.52 | 4.56 | 17.9 |
| 50 | 8.84 | 2.93 | 11.6 |

![submit fabric tps performance](../../../../../charts/2.1.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchTPS.png)

![submit fabric latency performance](../../../../../charts/2.1.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchLatency.png)

![submit fabric cycles performance](../../../../../charts/2.1.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchCycles.png)

![submit fabric resource utilization](../../../../../charts/2.1.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchRadar.png)