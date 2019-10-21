The pageinated rich query enchmark consists of evaluating `paginatedRichQuery` gateway transactions for the fixed-asset smart contract deployed within a CouchDB network that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract rich query pathway](../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a fixed number of mixed byte size assets in the range [100, 1000, 2000, 4000, 8000, 16000, 32000, 64000] from the world state database based on the following Mango query that matches an index created in CouchDB:

```bash
{
  'selector': {
	'docType': 'fixed-asset', 
	'creator': 'clientId’, 
	'bytesize': 'bytesize'
  }
}
```

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog for each of the test clients. Successive rounds increase the page size of assets retrieved from the world state database.

## Benchmark Results

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 21.68 | 0.29 | 80.9 |
| 20 | 14.58 | 0.77 | 30.8 |
| 50 | 15.13 | 2.08 | 12.1 |
| 100 | 16.31 | 3.75 | 7.1 |
| 200 | 23.35 | 6.41 | 3.9 |
| 500 | 23.48 | 4.49 | 1.1 |

![paginated rich query fabric tps performance](../../../../charts/1.4.0/nodeJS/nodeSDK/richQuery/RichQueryTPS.png)

![paginated rich query fabric latency performance](../../../../charts/1.4.0/nodeJS/nodeSDK/richQuery/RichQueryLatency.png)

![paginated rich query fabric resource utilization](../../../../charts/1.4.0/nodeJS/nodeSDK/richQuery/RichQueryCycles.png)

## Benchmark Observations
Increasing the page size of a rich query has significant impact on the achievable throughput and latency. This corresponds with significantly increased network I/O across the target peer, smart contract and the CouchDB world state database.

Inspection of the resource utilization statistics for the individual benchmark runs show that the peer must deal with a significant network I/O load. This is a result of the peer obtaining and relaying the information from CouchDB to the smart contract transaction, and then passing back the resulting data from the smart contract transaction to the calling client application.