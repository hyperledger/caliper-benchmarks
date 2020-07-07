The asset retrieval benchmark consists of evaluating `getPrivateAsset` gateway transactions for the fixed-asset smart contract deployed within CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the Private Data Collection of the authorized organization, resulting in the pathway depicted in Figure 1.

![evaluate contract get pathway](../../../../../diagrams/TransactionRoute_Evaluate_PrivateData.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a single asset with a randomised UUID from the Private Data Collection of the authorized organization.

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 25 transactions for each of the 10 test clients running on CouchDB.

## Benchmark Results
*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
| 100 | 1.36 | 0.50 | 703.3 |
| 1K | 1.47 | 0.53 | 643.9 |
| 2K | 1.75 | 0.75 | 454.5 |
| 4K | 1.29 | 0.45 | 457.2 |
| 8K | 2.49 | 1.20 | 259.2 |
| 16K | 2.10 | 0.90 | 196.4 |
| 32K | 3.81 | 1.27 | 112.6 |
| 64K | 5.09 | 2.42 | 60.1 |

## Benchmark Configuration File

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>

```
workers:
  type: local
  number: 10
rounds:
  - label: get-private-asset-evaluate-100
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 100 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
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
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-1000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 1000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 1000
      bytesize: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-2000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 2000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 2000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-4000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 4000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 4000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 8000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-16000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 16000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 16000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-32000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 32000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 32000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-64000
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 64000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      bytesize: 64000
      assets: 1000
      consensus: false
    callback: benchmarks/api/fabric/lib/get-private-asset.js
  - label: get-private-asset-evaluate-8000-fixed-tps
    description: >-
      Test an evaluateTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `getPrivateAsset`. This method performs
      a getPrivateData on an item that matches an asset of size 8000 bytes at a fixed TPS.
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
    callback: benchmarks/api/fabric/lib/get-private-asset.js
```
</details>