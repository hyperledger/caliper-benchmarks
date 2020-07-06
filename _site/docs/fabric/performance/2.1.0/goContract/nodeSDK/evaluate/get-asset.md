The asset retrieval benchmark consists of evaluating `getAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract get pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a single asset with a randomised UUID from the world state database.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 0.95 | 0.39 | 811.2|
| 1K | 1.39 | 0.99 | 340.1 |
| 2K | 1.56 | 1.17 | 322.4 |
| 4K | 1.61 | 1.01 | 360.7 |
| 8K | 1.83 | 1.07 | 292.4 |
| 16K | 2.44 | 1.30 | 218.3 |
| 32K | 4.38 | 2.48 | 96.5 |
| 64K | 7.92 | 5.18 | 63.8 |

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 1.08 | 0.41 | 832.0 |
| 1K | 1.25 | 0.71 | 539.1 |
| 2K | 1.58 | 1.05 | 423.8 |
| 4K | 2.03 | 1.51 | 264.3 |
| 8K | 2.14 | 1.28 | 268.4 |
| 16K | 2.42 | 1.29 | 215.9 |
| 32K | 4.56 | 2.59 | 92.5 |
| 64K | 8.35 | 5.82 | 63.6 |

## Benchmark Configuration File