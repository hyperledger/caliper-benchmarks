The batch asset retrieval benchmark consists of evaluating `getAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract batch get pathway](../../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a set of assets, formed by a randomised selection of available UUIDs, from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 20 transactions for each of the 10 test clients. Successive rounds increase the batch size of the assets retrieved from the world state database with a fixed asset size of 8Kb.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 1.20 | 0.40 | 382.3 |
| 10 | 3.69 | 1.72 | 59.4 |
| 20 | 6.41 | 3.39 | 33.1 |
| 30 | 9.03 | 4.26 | 23.9 |
| 40 | 11.63 | 5.89 | 17.3 |
| 50 | 14.27 | 6.23 | 14.1 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 1.24 | 0.41| 343.5 |
| 10 | 3.81 | 1.81 | 52.3 |
| 20 | 5.66 | 2.94 | 33.2 |
| 30 | 9.50 | 4.58 | 20.7 |
| 40 | 11.41 | 5.06 | 16.7 |
| 50 | 15.05 | 6.47 | 13.4 |

![batch query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchTPS.png)

![batch query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchLatency.png)

![batch query fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/getAssetBatch/GetAssetBatchCycles.png)

## Benchmark Observations
The CouchDB world state database is observed to achieve comparable throughput and comparable latency when comapred with its LevelDB equivalent.
