The create asset benchmark consists of submitting `createAsset` gateway transactions for the fixed-asset smart contract deployed within CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a single asset into the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 100 transactions for each of the 10 test clients. Successive rounds increase the size of the asset inserted into the world state database.

## Benchmark Results

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 8.81 | 4.04 | 165.1 |
| 2K | 9.02 | 4.17 | 160.0 |
| 4K | 8.64 | 4.11 | 158.0 |
| 8K | 8.66 | 4.28 | 153.7 |
| 16K | 14.08 | 6.08 | 111.7 |
| 32K | 25.23 | 10.75 | 55.9 |
| 64K | 40.74 | 17.85 | 31.8 |

![submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetTPS.png)

![submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetLatency.png)

![submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAsset/CreateAssetCycles.png)
