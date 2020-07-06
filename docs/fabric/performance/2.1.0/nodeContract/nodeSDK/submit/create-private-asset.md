The create private asset benchmark consists of submitting `createPrivateAsset` gateway transactions for the fixed-asset smart contract deployed within CouchDB networks that uses a 2-of-any endorsement policy. This will result in the method being run on Hyperledger Fabric Peers as required by the endorsement policy and a hash of the private data being appended to the ledger by the Orderer. The investigated scenarios are targeted at writing to the Private Data Collection of the authorized organization, resulting in the transaction pathway as depicted in Figure 1.

![submit contract create pathway](../../../../../diagrams/TransactionRoute_Submit_PrivateData.png)*Figure 1: Submit Transaction Pathway*

Each transaction inserts a single asset into the Private Data Collection of the authorized organization.

## Benchmark Results
*CouchDB*

| Asset Size (bytes) | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ------------------ | --------------- | --------------- | ---------------- |
|100	|2.11	|1.55	|18.4 |
|1k	    |2.05	|1.53	|19.2 |
|4k	    |2.06	|1.42	|20.3 |
|8k	    |2.09	|1.68	|16.1|
|16k	|2.10	|1.70	|16.2 |
|32k	|2.12	|1.70	|16.7 |
|64k	|2.23	|1.78	|15.5 |

## Benchmark Configuration File

<details>
  <summary>Click to expand CouchDB Benchmark Configuration</summary>

```
workers:
  type: local
  number: 5
rounds:
  - label: create-private-asset-100
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size 
      100 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl: 
      type: fixed-backlog
      opts:
        unfinished_per_client: 10
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 100
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-1000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      1000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 10
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 1000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-4000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      4000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
    type: fixed-backlog
    opts:
      unfinished_per_client: 10
      startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 4000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-8000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      8000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
    type: fixed-backlog
    opts:
      unfinished_per_client: 10
      startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-16000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      16000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 10
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 16000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-32000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      32000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 10
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 32000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-64000
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      64000 bytes into the Private Data Collection of the authorized organization.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 10
        startingTps: 1
    arguments:
      chaincodeID: fixed-asset
      bytesize: 64000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
  - label: create-private-asset-8000-fixed-tps
    description: >-
      Test a submitTransaction() Gateway method against the NodeJS `fixed-asset`
      Smart Contract method named `createPrivateAsset`, which inserts an asset of size
      8000 bytes into the Private Data Collection of the authorized organization at a fixed TPS rate.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-rate
      opts:
        tps: 15
    arguments:
      chaincodeID: fixed-asset
      bytesize: 8000
    callback: benchmarks/api/fabric/lib/create-private-asset.js
```
</details>