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

## Versions
An export is used to configure the appropriate level network; due to RAFT coming in at Fabric version 1.4.1, we are restricted to that level and above
- Fabric 1.4.X : 1.4.X