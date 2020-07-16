The batch create asset benchmark consists of submitting `createAssetsFromBatch` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks that uses a 2-of-any endorsement policy. This will result on the method being run on Hyperledger Fabric Peers as required by the endorsement policy and appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the world state database, resulting in the transaction pathway as depicted in Figure 1.

![submit contract batch create pathway](../../../../../diagrams/TransactionRoute_Submit.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a set of 8k byte sized assets into the world state database.

## Benchmark Results
*LevelDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
|1	|0.56	|0.36	|378.8|
|10	|2.96	|1.60	|73.8|
|20	|6.31	|3.15	|39.7|
|30	|6.49	|3.88	|27.3|
|40	|6.67	|3.75	|24.8|
|50	|8.16	|4.53	|17.2|


*CouchDB*

| Batch Size | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---------- | --------------- | --------------- | ---------------- |
|1		|0.55		|0.35	|247.4 |
|10		|2.78		|1.63	|49.6  |
|20		|5.41		|2.86	|25.1  |
|30		|7.83		|4.17	|17.8  |
|40		|11.78		|6.16	|11.9  |
|50		|14.26		|7.22	|10.5  |

## Benchmark Configuration File
<details>
  <summary>Click to expand LevelDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 5
rounds:
  - label: create-asset-batch-20-8000-fixed-tps
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 20 assets of size 8k bytes into the World State database at a fixed
      TPS.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 40
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 20
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-1-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 1 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 40
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 1
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-10-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 10 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 40
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 10
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-20-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 20 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 40
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 20
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-30-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 30 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 35
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 30
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-40-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 40 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 30
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 40
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-50-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 50 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 50
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
```
</details>

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>
  
```
workers:
  type: local
  number: 5
rounds:
  - label: create-asset-batch-20-8000-fixed-tps
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 20 assets of size 8k bytes into the World State database at a fixed
      TPS.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 5
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 20
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-1-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 1 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 1
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-10-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 10 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 10
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-20-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 20 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 20
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-30-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 30 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 30
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-40-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 40 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 40
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
  - label: create-asset-batch-50-8000
    description: >-
      Test a submitTransaction() Gateway method against the Go `fixed-asset`
      Smart Contract method named `createAssetsFromBatch`, which inserts a batch
      of 50 assets of size 8k bytes into the World State database.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 25
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
      batchsize: 50
    callback: benchmarks/api/fabric/lib/batch-create-asset.js
```
</details>