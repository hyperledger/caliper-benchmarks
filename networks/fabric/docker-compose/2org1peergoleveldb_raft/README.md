# About the network

This directory contains a sample __Fabric__ network with the following properties.

## Topology
* The network has 2 participating organizations.
* The network has uses a RAFT orderer, with 3 nodes
* Each organization has 1 peer in the network.
* The peers use __GoLevelDB__ as the world-state database.
* A channel named `mychannel` is created and the peers are joined.
* A sample chaincode is installed and instantiated. See the [configuration section](#platform-configurations) for details.

## Communication protocol
* The `docker-compose-tls.yaml` file specifies a network __with TLS__ communication.

The configuration files names (with or without the `(-mutual)-tls` part) indicate which network type it relies on. They are not distinguished further in the next sections.

## Metrics
* The `docker-compose-tls-prometheus.yaml` file specifies a network that publishes Prometheus metrics. See the following for the available metrics: https://hyperledger-fabric.readthedocs.io/en/release-1.4/metrics_reference.html

*NOTE*: 
* Prometheus metrics are only available on Fabric v1.4.0 and above
* `docker-compose-prometheus.yaml` relies on the companion network `/prometheus-grafana/docker-compose-fabric.yml` being stood up in advance as they must exist on the same docker network

## Versions
An export is used to configure the appropriate level network; due to RAFT coming in at Fabric version 1.4.1, we are restricted to that level and above
- Fabric 1.4.X : 1.4.X