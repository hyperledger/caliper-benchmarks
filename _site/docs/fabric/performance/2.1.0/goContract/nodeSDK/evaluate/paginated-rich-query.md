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

## Benchmark Results

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10 | 17.43 | 4.31 | 99.6 |
| 20 | 12.82 | 3.53 | 45.9 |
| 50 | 10.54 | 3.23 | 19.8 |
| 100 | 10.14 | 3.72 | 10.0 |
| 200 | 10.33 | 4.90 | 5.1 |
| 500 | 19.65 | 8.64 | 1.8 |

## Benchmark Configuration File