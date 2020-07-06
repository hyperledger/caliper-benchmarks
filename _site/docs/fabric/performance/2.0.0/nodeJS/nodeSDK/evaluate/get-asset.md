The asset retrieval benchmark consists of evaluating `getAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract get pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a single asset with a randomised UUID from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 50 transactions for each of the 10 test clients running on LevelDB, and a constant transaction backlog of 100 transactions for each of the 10 test clients running on CouchDB.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.82 | 0.35 | 862.5 |
| 1K | 1.25 | 0.78 | 458.8 |
| 2K | 1.85 | 1.68 | 103.6 |
| 4K | 1.51 | 0.87 | 381.4 |
| 8K | 2.08 | 1.31 | 257.8 |
| 16K | 2.21 | 1.14 | 226.3 |
| 32K | 4.3 | 2.15 | 120.3 |
| 64K | 9.16 | 6.45 | 31.7 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 1.34 | 0.56 | 658.4 |
| 1K | 1.91 | 0.83 | 566.4 |
| 2K | 1.86 | 1.11 | 353.2 |
| 4K | 2.18 | 1.17 | 347.8 |
| 8K | 2.12 | 1.27 | 249.7 |
| 16K | 2.47 | 1.28 | 199.2 |
| 32K | 4.3 | 2.25 | 109.7 |
| 64K | 7.63 | 3.25 | 63.8 |

![single query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAsset/GetAssetTPS.png)

![single query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAsset/GetAssetLatency.png)

![single query fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAsset/GetAssetCycles.png)

![single query resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAsset/GetAssetRadar.png)