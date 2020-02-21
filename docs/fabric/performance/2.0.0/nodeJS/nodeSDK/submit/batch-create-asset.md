The batch create asset benchmark consists of submitting `createAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a set of assets into the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 5 transactions for each of the 4 test clients. Successive rounds increase the batch size of the assets inserted into the world state database with a fixed asset size of 8Kb.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.29 | 0.23 | 55.3 |
| 10 | 0.96 | 0.55 | 24.9 |
| 20 | 1.80 | 1.04 | 12.0 |
| 30 | 2.87 | 1.71 | 7.5 |
| 40 | 5.30 | 2.55 | 5.1 |
| 50 | 5.23 | 3.25 | 4.0 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.32 | 0.25 | 54.1 |
| 10 | 1.01 | 0.68 | 20.4 |
| 20 | 2.73 | 1.27 | 10.3 |
| 30 | 5.32 | 2.04 | 6.5 |
| 40 | 7.87 | 2.98 | 4.5 |
| 50 | 7.34 | 3.69 | 3.8 |

![batch submit fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchTPS.png)

![batch submit fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchLatency.png)

![batch submit fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchCycles.png)

## Benchmark Observations
Use of a LevelDB world state database compared to a CouchDB world state database is seen to enable slighlt higher throughput and lower latencies with small batch sizes. The benefit of higher throughput of LevelDB over CouchDB is lost with larger batch sizes.
