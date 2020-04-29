The delete asset benchmark consists of submitting `deleteAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction deletes a single asset with a randomised UUID from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 5 test clients running on LevelDB, and a constant transaction backlog of 100 transactions for each of the 5 test clients running on CouchDB.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.27 | 0.25 | 124.8 |
| 1K | 0.26 | 0.25 | 142.8 |
| 2K | 0.26 | 0.25 | 144.1 |
| 4K | 0.26 | 0.25 | 144.4 |
| 8K | 0.26 | 0.25 | 152.9 |
| 16K | 0.27 | 0.25 | 129.4 |
| 32K | 0.26 | 0.24 | 137.7 |
| 64K | 0.26 | 0.25 | 148.4 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 3 | 2.56 | 21.8 |
| 1K | 9.73 | 2.64 | 31.4 |
| 2K | 3.29 | 2.68 | 22.4 |
| 4K | 3.05 | 2.61 | 21.5 |
| 8K | 2.97 | 2.59 | 22.2 |
| 16K | 3.07 | 2.59 | 21.9 |
| 32K | 2.92 | 2.59 | 21.6 |
| 64K | 3.12 | 2.66 | 20.3 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetCycles.png)

![submit resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetRadar.png)