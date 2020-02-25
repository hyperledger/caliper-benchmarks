The delete asset benchmark consists of submitting `deleteAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction deletes a single asset with a randomised UUID from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 5 test clients running on LevelDB, and a constant transaction backlog of 100 transactions for each of the 5 test clients running on CouchDB.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 1.38 | 0.64 | 78.7 |
| 1K | 0.27 | 0.24 | 133.9 |
| 2K | 0.27 | 0.23 | 130.4 |
| 4K | 0.27 | 0.24 | 133.6 |
| 8K | 0.27 | 0.24 | 138.0 |
| 16K | 0.27 | 0.24 | 122.9 |
| 32K | 0.27 | 0.24 | 136.9 |
| 64K | 3.11 | 0.24 | 136.0 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 2.33 | 1.30 | 183.5 |
| 1K | 2.17 | 1.31 | 180.6 |
| 2K | 2.58 | 1.27 | 180.7 |
| 4K | 2.95 | 1.38 | 183.2 |
| 8K | 2.85 | 1.33 | 171.4 |
| 16K | 2.37 | 1.26 | 185.2 |
| 32K | 2.28 | 1.36 | 182.5 |
| 64K | 3.11 | 1.45 | 168.3 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/deleteAsset/DeleteAssetCycles.png)

## Benchmark Obsevations
The LevelDB world state database facilitates asset deletion at lower throughputs and lower latencies than the CouchDB world state database. The throughput advantage of CouchDB is maintained with larger asset sizes, and the latency advantage of LevelDB is maintained with larger asset sizes.