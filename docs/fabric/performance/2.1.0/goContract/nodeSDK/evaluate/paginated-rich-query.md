The paginated rich query benchmark consists of evaluating `paginatedRichQuery` gateway transactions for the fixed-asset smart contract deployed within a CouchDB network that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract rich query pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a fixed number of mixed byte size assets in the range [100, 1000, 2000, 4000, 8000, 16000, 32000, 64000] from the world state database based on the following Mango query that matches an index created in CouchDB:

```bash
{
  'selector': {
	'docType': 'fixed-asset', 
	'creator': 'clientId', 
	'bytesize': 'bytesize'
  }
}
```

## Benchmark Results

| Page Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| --------- | --------------- | --------------- | ---------------- |
| 10	 | 20.54	 | 6.59	 | 107.0 |
| 20	 | 22.07	 | 7.04	 | 81.7 |
| 50	 | 23.43	 | 7.55	 | 52.4 |
| 100	 | 27.23	 | 8.08	 | 35.3 |
| 200	 | 23.20	 | 7.83	 | 19.4 |
| 500	 | 23.43	 | 7.40	 | 8.9 |

## Benchmark Configuration File

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 5
rounds:
  - label: mixed-rich-query-evaluate-10
    description: >-
      Test a evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`.  This
      method performs a paginated rich query, with a passed pagesize of 10 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      assets: 8000
      pagesize: '10'
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
  - label: mixed-rich-query-evaluate-20
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`. This
      method performs a paginated rich query, with a passed pagesize of 20 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      pagesize: '20'
      nosetup: true
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
  - label: mixed-rich-query-evaluate-50
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`. This
      method performs a paginated rich query, with a passed pagesize of 50 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      pagesize: '50'
      nosetup: true
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
  - label: mixed-rich-query-evaluate-100
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`. This
      method performs a paginated rich query, with a passed pagesize of 100 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      pagesize: '100'
      nosetup: true
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
  - label: mixed-rich-query-evaluate-200
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`. This
      method performs a paginated rich query, with a passed pagesize of 200 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      pagesize: '200'
      nosetup: true
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
  - label: mixed-rich-query-evaluate-500
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `paginatedRichQuery`. This
      method performs a paginated rich query, with a passed pagesize of 500 and
      query string that matches all assets created by the calling client. Each
      returned asset is of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 5
        startingTps: 5
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
      pagesize: '500'
      nosetup: true
      consensus: false
    callback: benchmarks/api/fabric/lib/mixed-rich-query-asset.js
```
</details>
