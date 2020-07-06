The batch create asset benchmark consists of submitting `createAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a set of assets into the world state database.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.29 | 0.22 | 59.7 |
| 10 | 1.06 | 0.66 | 22.0 |
| 20 | 2.45 | 1.36 | 10.7 |
| 30 | 5.60 | 2.60 | 5.6 |
| 40 | 5.92 | 3.33 | 4.3 |
| 50 | 8.20 | 4.45 | 3.3 |

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
| 1 | 0.31 | 0.25 | 57.5 |
| 10 | 1.72 | 0.77 | 19.4 |
| 20 | 2.58 | 1.60 | 9.6 |
| 30 | 5.43 | 2.83 | 5.3 |
| 40 | 7.06 | 3.85 | 4.0 |
| 50 | 8.64 | 4.87 | 3.0 |

## Benchmark Configuration File