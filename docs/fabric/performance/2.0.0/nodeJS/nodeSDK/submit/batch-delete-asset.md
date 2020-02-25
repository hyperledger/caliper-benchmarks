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
| 1 | 1.00 | 0.57 | 92.8 |
| 10 | 2.7 | 1.46 | 54.3 |
| 20 | 4.49 | 2.43 | 39.1 |
| 30 | 6.78 | 3.31 | 21.7 |
| 40 | 8.42 | 4.38 | 19.6 |
| 50 | 10.9 | 3.77 | 13.2 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAssetBatch/DeleteAssetBatchCycles.png)

## Benchmark Observations
When comapred with the CouchDB world state database, the LevelDB world state database has a higher throughput for smaller batch sizes and a comparable throughput for larger batch sizes. The transaction latency for a LevelDB world state databases is lower when comapred to a CouchDB world state database, especially for larger batch sizes.
