The batch create asset benchmark consists of submitting `createAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a set of assets into the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 5 transactions for each of the 4 test clients. Successive rounds increase the batch size of the assets inserted into the world state database with a fixed asset size of 8Kb.

## Benchmark Results

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
