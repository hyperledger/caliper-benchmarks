The create asset benchmark consists of submitting `createAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a single asset into the world state database.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.59 | 0.32 | 215.6 |
| 2K | 0.59 | 0.33 | 208.5 |
| 4K | 0.55 | 0.34 | 198.7 |
| 8K | 0.62 | 0.34 | 201.4 |
| 16K | 0.88 | 0.48 | 126.3 |
| 32K | 2.46 | 1.14 | 50.9 |
| 64K | 4.19 | 1.93 | 29.3 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.37 | 0.28 | 121.9 |
| 2K | 0.39 | 0.30 | 112.1 |
| 4K | 0.39 | 0.29 | 113.7 |
| 8K | 0.39 | 0.30 | 111.0 |
| 16K | 0.52 | 0.32 | 107.5 |
| 32K | 1.26 | 0.65 | 50.3 |
| 64K | 2.33 | 1.10 | 28.8 |

## Benchmark Configuration File