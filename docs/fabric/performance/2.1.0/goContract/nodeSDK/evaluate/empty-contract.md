The Empty Contract Benchmark consists of evaluating `emptyContract` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks. This will result on the transaction being run on a single Hyperledger Fabric Peer and will not result in any interaction with the Orderer, resulting in the transaction pathway depicted in Figure 1.

![evaluate empty contract pathway](../../../../../diagrams/TransactionRoute_EvaluateEmpty.png)*Figure 1: Evaluate Transaction Pathway*

This is repeated for networks that use the following endorsement policies:
 
 - 1-of-any
 - 2-of-any

## Benchmark Results
*LevelDB- evaluate transactions with varying endorsement policy*

| Type | Policy | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---- | ------ | --------------- | --------------- | ---------------- |
| evaluate | 1-of-any | 1.44 | 0.36	| 1800.1 |
| evaluate | 2-of-any | 1.35 | 0.37 | 1798.1 |

*CouchDB- evaluate transactions with varying endorsement policy*

| Type | Policy | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---- | ------ | --------------- | --------------- | ---------------- |
| evaluate | 1-of-any | 0.77 | 0.39	| 1185.1 |
| evaluate | 2-of-any | 0.73 | 0.36 | 1381.9 |

## Benchmark Configuration File
<details>
  <summary>Click to expand LevelDB 1OF Benchmark Configuration</summary>

```
workers:
  type: local
  number: 10
rounds:
  - label: empty-contract-evaluate
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `emptyContract`, which
      immediately returns a null response. This represents the fastest possible
      round trip time for an evaluateTransaction() method that does not touch
      the world state or perform any action.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 200
    arguments:
      chaincodeID: fixed-asset
      consensus: false
    callback: benchmarks/api/fabric/lib/empty-contract.js
```
</details>

<details>
  <summary>Click to expand LevelDB 2OF Benchmark Configuration</summary>

```
workers:
  type: local
  number: 10
rounds:
  - label: empty-contract-evaluate
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `emptyContract`, which
      immediately returns a null response. This represents the fastest possible
      round trip time for an evaluateTransaction() method that does not touch
      the world state or perform any action.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 200
    arguments:
      chaincodeID: fixed-asset
      consensus: false
    callback: benchmarks/api/fabric/lib/empty-contract.js
```
</details>

<details>
  <summary>Click to expand CouchDB 1OF Benchmark Configuration</summary>

```
workers:
  type: local
  number: 10
rounds:
  - label: empty-contract-evaluate
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `emptyContract`, which
      immediately returns a null response. This represents the fastest possible
      round trip time for an evaluateTransaction() method that does not touch
      the world state or perform any action.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 200
    arguments:
      chaincodeID: fixed-asset
      consensus: false
    callback: benchmarks/api/fabric/lib/empty-contract.js
```
</details>

<details>
  <summary>Click to expand CouchDB 2OF Benchmark Configuration</summary>

```
workers:
  type: local
  number: 10
rounds:
  - label: empty-contract-evaluate
    description: >-
      Test an evaluateTransaction() Gateway method against the Go
      `fixed-asset` Smart Contract method named `emptyContract`, which
      immediately returns a null response. This represents the fastest possible
      round trip time for an evaluateTransaction() method that does not touch
      the world state or perform any action.
    chaincodeID: fixed-asset
    txDuration: 300
    rateControl:
      type: fixed-backlog
      opts:
        unfinished_per_client: 200
        startingTps: 10
    arguments:
      chaincodeID: fixed-asset
      consensus: false
    callback: benchmarks/api/fabric/lib/empty-contract.js
```
</details>