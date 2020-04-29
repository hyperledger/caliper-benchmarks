The batch delete asset benchmark consists of submitting `deleteAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction deletes a set of assets, formed by a randomised selection of available UUIDs, from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 10 test clients. Successive rounds increase the batch size of the assets deleted from the world state database with a fixed asset size of 8Kb.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.51 | 0.36 | 115.2 |
| 10 | 0.87 | 0.56 | 105.9 |
| 20 | 1.07 | 0.79 | 97.4 |
| 30 | 2.27 | 0.88 | 32.4 |
| 40 | 1.84 | 0.90 | 30.8 |
| 50 | 0.68 | 0.65 | 7.0 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.42 | 0.29 | 135.1 |
| 10 | 1.43 | 0.68 | 77.5 |
| 20 | 0.95 | 0.73 | 103.8 |
| 30 | 0.72 | 0.59 | 6.3 |
| 40 | 2.86 | 1.42 | 28.4 |
| 50 | 0.84 | 0.78 | 7.1 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchCycles.png)

![submit fabric resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchRadar.png)