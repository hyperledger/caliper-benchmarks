The paginated rich query benchmark consists of evaluating `paginatedRichQuery` gateway transactions for the fixed-asset smart contract deployed within a CouchDB network that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract rich query pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

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

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 5 transactions for each of the 4 test clients. Successive rounds increase the page size of assets retrieved from the world state database.

## Benchmark Results

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 14.24 | 3.71 | 87.7 |
| 20 | 14.35 | 3.11 | 44.5 |
| 50 | 10.57 | 3.08 | 20.6 |
| 100 | 8.96 | 3.30 | 11.9 |
| 200 | 9.29 | 3.99 | 4.9 |
| 500 | 16.54 | 7.44 | 1.9 |

![paginated rich query fabric tps performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/richQuery/RichQueryTPS.png)

![paginated rich query fabric latency performance](../../../../../charts/2.0.0/nodeJS/nodeSDK/richQuery/RichQueryLatency.png)

![paginated rich query fabric resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/richQuery/RichQueryCycles.png)
