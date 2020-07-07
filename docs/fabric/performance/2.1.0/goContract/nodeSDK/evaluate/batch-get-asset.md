The batch asset retrieval benchmark consists of evaluating `getAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer. The investigated scenarios are targeted at reading from the world state database, resulting in the transaction pathway depicted in Figure 1.

![evaluate contract batch get pathway](../../../../../diagrams/TransactionRoute_Evaluate.png)*Figure 1: Evaluate Transaction Pathway*

Each transaction retrieves a set of 8k byte size assets, formed by a randomised selection of available UUIDs, from the world state database.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
|1	|1.92	|1.19	|415.2|
|10	|4.25	|2.97	|169.5|
|20	|9.44	|6.03	|111.8|
|30	|10.46	|6.61	|66.3|
|40	|16.22	|7.80	|49.3|
|50	|19.64	|9.86	|46.7|

*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
|1	 | 1.65	     | 1.06	 | 412.2 |
|10	 | 4.11	     | 2.69	 | 144.1 |
|20	 | 5.69	     | 3.48	 | 106.8 |
|30	 | 10.21	 | 5.44	 | 60.1 |
|50	 | 16.03	 | 7.97	 | 40.7 |

## Benchmark Configuration File
<details>
  <summary>Click to expand LevelDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 10
rounds:
  - label: get-asset-batch-evaluate-1-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 1 UUID that matches an asset of
      size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 8000
      assets: 8000
      bytesize: 8000
      batchsize: 1
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-10-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 10 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 8000
      assets: 8000
      bytesize: 8000
      batchsize: 10
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-20-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 20 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 20
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-30-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 30 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 30
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-40-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 40 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 40
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-50-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 50 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 100
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 50
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-20-8000-fixed-tps
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 20 UUIDs that each match an asset
      of size 8000 bytes at a fixed TPS.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 30
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 20
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
```
</details>

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 10
rounds:
  - label: get-asset-batch-evaluate-1-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 1 UUID that matches an asset of
      size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      create_sizes:
        - 8000
      assets: 8000
      bytesize: 8000
      batchsize: 1
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-10-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 10 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 10
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-20-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 20 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 20
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-30-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 30 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 30
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-40-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 40 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 40
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-50-8000
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 50 UUIDs that each match an asset
      of size 8000 bytes.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 80
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 50
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
  - label: get-asset-batch-evaluate-20-8000-fixed-tps
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `getAssetsFromBatch`. This
      method performs a getState on a batch of 20 UUIDs that each match an asset
      of size 8000 bytes at a fixed TPS.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 30
    arguments:
      chaincodeID: fixed-asset
      nosetup: true
      assets: 8000
      bytesize: 8000
      batchsize: 20
      consensus: false
    callback: benchmarks/api/fabric/lib/batch-get-asset.js
```
</details>