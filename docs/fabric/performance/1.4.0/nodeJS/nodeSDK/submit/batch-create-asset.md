The batch create asset benchmark consists of submitting `createAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a set of assets into the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog for each of the test clients. Successive rounds increase the batch size of the assets inserted into the world state database with a fixed asset size of 8Kb.

Resource utilization is investigated for a fixed transaction rate of 15TPS and a batch size of 20.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.55 | 0.11 | 129.8 |
| 10 | 0.85 | 0.39 | 39.1 |
| 20 | 2.04 | 0.72 | 19.7 |
| 30 | 1.67 | 0.91 | 15.5 |
| 40 | 2.39 | 1.22 | 11.1 |
| 50 | 8.83 | 2.02 | 7.4 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.55 | 0.15 | 104.9 |
| 10 | 0.93 | 0.48 | 31.4 |
| 20 | 1.99 | 0.80 | 18.4 |
| 30 | 2.14 | 1.13 | 12.7 |
| 40 | 2.82 | 1.42 | 9.8 |
| 50 | 3.29 | 1.77 | 7.5 |

![batch submit fabric tps performance](../../../../../charts/1.4.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchTPS.png)

![batch submit fabric latency performance](../../../../../charts/1.4.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchLatency.png)

![batch submit fabric cycles performance](../../../../../charts/1.4.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchCycles.png)

*Resource Utilization- Batch Size 20 @15TPS*
![batch submit fabric resource utilization](../../../../../charts/1.4.0/nodeJS/nodeSDK/createAssetBatch/CreateAssetBatchRadar.png)

## Benchmark Observations
Use of a LevelDB world state database is seen to enable higher throughput and lower latencies with small batch sizes, though this benefit is lost with large batch sizes.

In comparing the resource utilization of a LevelDB world state database with a CouchDB equivalent during batch asset creation, there are similarities with the `Create Asset Benchmark`: implementing a CouchDB world state is CPU intensive, but is observed to be beneficial in terms of disc I/O.