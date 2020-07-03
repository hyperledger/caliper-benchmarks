The asset retrieval benchmark consists of evaluating `getAsset` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract get pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a single asset with a randomised UUID from the world state database.

## Benchmark Results
*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
|100 | 1.61	| 0.80	 | 835.6 |
|1k  | 1.75	| 1.11	 | 568.5 |
|2k	 | 1.85	| 1.30	 | 393.0 |
|4k	 | 2.03	| 1.19	 | 558.2 |
|8k	 | 2.11	| 1.36	 | 398.9 |
|16k | 2.33	| 1.60	 | 293.9 |
|32k | 2.48	| 1.59	 | 293.6 |
|64k | 2.77	| 1.81	 | 252.1 |

## Benchmark Configuration File

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 10
rounds:
  - label: get-asset-evaluate-100
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 100 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 100
        - 1000
        - 2000
        - 4000
        - 8000
        - 16000
        - 32000
        - 64000
      assets: 1000
      bytesize: 100
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-1000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 1000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 1000
      bytesize: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-2000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 2000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 2000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-4000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 4000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 4000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 8000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-16000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 16000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 16000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-32000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 32000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 32000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-64000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 64000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 64000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
  - label: get-asset-evaluate-8000-fixed-tps
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAsset`. This method performs
      a getState on an item that matches an asset of size 8000 bytes at a fixed
      TPS.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 350
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 8000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-asset.js
```
</details>