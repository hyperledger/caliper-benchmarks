The Empty Contract Benchmark consists of submitting `emptyContract` gateway transactions for the fixed-asset smart contract deployed within LevelDB and CouchDB networks. When submitting `emptyContract` gateway transactions, the interaction is recorded on the ledger. This results in the transaction pathway as depicted in Figure 1.

![submit empty contract pathway](../../../../../diagrams/TransactionRoute_SubmitEmpty.png)*Figure 1: Submit Empty Contract Transaction Pathway*

This is repeated for networks that use the following endorsement policies:
 
 - 1-of-any
 - 2-of-any

Achievable throughput and associated latencies are investigated through maintaining a constant transaction backlog of 100 transactions for each of the 10 test clients.

Resource utilization is investigated for fixed TPS rate of 350TPS and 300TPS.

## Benchmark Results
*LevelDB- submit transactions with varying endorsement policy*

| Type | Policy | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---- | ------ | --------------- | --------------- | ---------------- |
| submit | 1-of-any | 1.97 | 0.99 | 569.5 |
| submit | 2-of-any | 2.02 | 0.99 | 556.4 |

*CouchDB- submit transactions with varying endorsement policy*

| Type | Policy | Max Latency (s) | Avg Latency (s) | Throughput (TPS) |
| ---- | ------ | --------------- | --------------- | ---------------- |
| submit | 1-of-any | 3.85 | 1.39 | 407.3 |
| submit | 2-of-any | 3.06 | 1.45 | 420.9 |

*LevelDB Resource Utilization– Submit By Policy @350TPS*
![submit empty contract fabric with LevelDB resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/policies/LevelDB_submitByPolicy.png)

*CouchDB Resource Utilization– Submit By Policy @350TPS*
![submit empty contract fabric with CouchDB resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/policies/CouchDB_submitByPolicy.png)

*Resource Utilization– Submit 1ofAny Policy @350TPS*
![submit empty contract fabric with 1ofAny policy resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/policies/Submit_1ofAny.png)

*Resource Utilization– Submit 2ofAny Policy @350TPS*
![submit empty contract fabric with 1ofAny policy resource utilization](../../../../../charts/2.0.0/nodeJS/nodeSDK/policies/Submit_2ofAny.png)
