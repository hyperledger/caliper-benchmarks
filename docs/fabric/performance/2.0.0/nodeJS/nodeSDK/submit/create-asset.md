The create asset benchmark consists of submitting `createAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a single asset into the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 10 transactions for each of the 10 test clients running on LevelDB, and a constant transaction backlog of 100 transactions for each of the 10 test clients running on CouchDB.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.61 | 0.32 | 219.7 |
| 2K | 0.61 | 0.33 | 205.6 |
| 4K | 0.63 | 0.35 | 198.4 |
| 8K | 0.56 | 0.34 | 199.4 |
| 16K | 0.88 | 0.48 | 123.8 |
| 32K | 2.3 | 1.12 | 50.7 |
| 64K | 4.2 | 1.93 | 30.6 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.43 | 0.3 | 111.0 |
| 2K | 0.5 | 0.3 | 110.0 |
| 4K | 0.4 | 0.3 | 109.9 |
| 8K | 0.41 | 0.31 | 109.6 |
| 16K | 0.58 | 0.35 | 99.6 |
| 32K | 1.27 | 0.67 | 49.4 |
| 64K | 2.46 | 1.13 | 28.2 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetCycles.png)

![submit resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetRadar.png)