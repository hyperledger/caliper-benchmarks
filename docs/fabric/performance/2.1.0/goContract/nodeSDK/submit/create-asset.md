The create asset benchmark consists of submitting `createAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a single asset into the world state database.

## Benchmark Results
*LevelDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
|100	|0.39	|0.27	|592.6|
|1k	    |0.40	|0.28	|571.5|
|4k	    |0.56	|0.36	|458.7|
|8k	    |0.66	|0.44	|387.0|
|16k	|0.95	|0.61	|266.6|
|32k	|1.30	|0.89	|177.4|
|64k	|2.44	|1.31	|117.4|

*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
|100	|0.73	|0.47	|350.6 |
|1k	    |0.78	|0.51	|328.7 |
|4k	    |0.87	|0.57	|293.3 |
|8k	    |0.98	|0.64	|256.8 |
|16k	|1.46	|0.86	|187.3 |
|24k	|1.83	|1.10	|149.7 |
|32k	|2.12	|1.26	|125.8 |
|64k	|3.23	|2.08	|74.8 |

## Benchmark Configuration File
<details>
  <summary>Click to expand LevelDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 5
rounds:
  - label: create-asset-8000-fixed-tps
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      8000 bytes into the World State database at a fixed TPS rate.
    chaincodeID: fixed-asset
    txDuration: 30
    rateControl:
      type: fixed-rate
      opts:
        tps: 15
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-100
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      100 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 100
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-1000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      1000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 1000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-4000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      4000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 4000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      8000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-16000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      16000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 16000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-32000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      32000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 32000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-64000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      64000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
    arguments:
      chaincodeID: fixed-asset
      bytesize: 64000
    callback: benchmarks/api/fabric/lib/create-asset.js
```
</details>

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 5
rounds:
  - label: create-asset-8000-fixed-tps
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      8000 bytes into the World State database at a fixed TPS rate.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 15
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-100
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      100 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 100
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-1000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      1000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 1000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-4000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      4000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 4000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      8000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-16000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      16000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 16000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-24000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      24000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 24000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-32000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      32000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 32000
    callback: benchmarks/api/fabric/lib/create-asset.js
  - label: create-asset-64000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAsset`, which inserts an asset of size
      64000 bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 50
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 64000
    callback: benchmarks/api/fabric/lib/create-asset.js
```
</details>