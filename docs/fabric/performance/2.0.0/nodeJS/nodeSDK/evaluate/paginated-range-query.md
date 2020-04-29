The paginated range query benchmark consists of evaluating `paginatedRangeQuery` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that use a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract range query pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a fixed number of mixed byte size assets in the range [100, 1000, 2000, 4000, 8000, 16000, 32000, 64000] from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 2 transactions for each of the 4 test clients. Successive rounds increase the page size of assets retrieved from the world state database.

## Benchmark Results
*LevelDB*

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 0.71 | 0.21 | 39.6 |
| 20 | 1.07 | 0.46 | 18.5 |
| 50 | 3.49 | 1.68 | 5.2 |
| 100 | 6.64 | 3.81 | 2.3 |
| 200 | 20.43 | 9.05 | 1.0 |
| 300 | 29.72 | 15.31 | 0.5 |


*CouchDB*

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 0.67 | 0.18 | 37.3 |
| 20 | 0.70 | 0.35 | 18.9 |
| 50 | 2.27 | 1.35 | 5.0 |
| 100 | 5.14 | 2.84 | 2.4 |
| 200 | 12.68 | 7.32 | 0.8 |
| 300 | 19.70 | 12.07 | 0.4 |

![paginated range query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedTPS.png)

![paginated range query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedLatency.png)

![paginated range query fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedCycles.png)

![paginated range query resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedRadar.png)