The batch asset retrieval benchmark consists of evaluating `getAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract batch get pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a set of assets, formed by a randomised selection of available UUIDs, from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 10 test clients. Successive rounds increase the batch size of the assets retrieved from the world state database with a fixed asset size of 8Kb.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1  | 1.42 | 0.54 | 361.5 |
| 10 | 3.75 | 1.68 | 59.5 |
| 20 | 5.84 | 3.32 | 35.3 |
| 30 | 9.07 | 4.33 | 24.1 |
| 40 | 11.59 | 5.11 | 17.2 |
| 50 | 14.83 | 6.41 | 14.1 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 1.4 | 0.45| 341.3 |
| 10 | 3.94 | 1.9 | 51.3 |
| 20 | 5.66 | 2.81 | 33.4 |
| 30 | 9.55 | 4.73 | 20.5 |
| 40 | 11.63 | 5.21 | 16.6 |
| 50 | 14.96 | 6.32 | 13.4 |

![batch query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchTPS.png)

![batch query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchLatency.png)

![batch query fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchCycles.png)

*Resource Utilization- Batch Size 20 @30TPS*
![batch query fabric resource CPU utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchRadarCPU.png)
![batch query fabric resource Memory utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchRadarMemory.png)
![batch query fabric resource Network utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchRadarNetwork.png)