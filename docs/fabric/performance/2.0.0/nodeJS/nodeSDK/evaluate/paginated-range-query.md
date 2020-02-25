The paginated range query benchmark consists of evaluating `paginatedRangeQuery` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that use a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract range query pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a fixed number of mixed byte size assets in the range [100, 1000, 2000, 4000, 8000, 16000, 32000, 64000] from the world state database.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 2 transactions for each of the 4 test clients. Successive rounds increase the page size of assets retrieved from the world state database.

## Benchmark Results
*LevelDB*

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 0.70 | 0.17 | 39.6 |
| 20 | 0.82 | 0.35 | 18.6 |
| 50 | 2.71 | 1.38 | 4.9 |
| 100 | 5.97 | 2.82 | 2.4 |
| 200 | 15.17 | 6.52 | 1.0 |
| 300 | 24.41 | 12.53 | 0.5 |


*CouchDB*

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 0.54 | 0.17 | 37.2 |
| 20 | 0.72 | 0.35 | 18.4 |
| 50 | 2.36 | 1.32 | 5.2 |
| 100 | 5.12 | 2.86 | 2.2 |
| 200 | 12.51 | 6.77 | 0.9 |
| 300 | 19.57 | 12.18 | 0.4 |

![paginated range query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedTPS.png)

![paginated range query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedLatency.png)

![paginated range query fabric cycles performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/rangeQuery/RangeQueryMixedCycles.png)

## Benchmark Observations
The CouchDB world state database is observed to achieve comparable throughput and comparable latency when comapred with its LevelDB equivalent.
