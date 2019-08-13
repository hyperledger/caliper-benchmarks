# About the network

This directory contains a sample __Fabric__ network with the following properties.

## Topology
* The network has 2 participating organizations.
* The network has 1 orderer node in solo mode.
* Each organization has 1 peer in the network.
* The peers use __GoLevelDB__ as the world-state database.
* A channel named `mychannel` is created and the peers are joined.
* A sample chaincode is installed and instantiated. See the [configuration section](#platform-configurations) for details.

## Communication protocol
* The `docker-compose.yaml` file specifies a network __without TLS__ communication.
* The `docker-compose-tls.yaml` file specifies a network __with TLS__ communication.

The configuration files names (with or without the `(-mutual)-tls` part) indicate which network type it relies on. They are not distinguished further in the next sections.

## Versions
An export is used to configure the appropriate level network, based on the following map:

- Fabric v1.0 : x86_64-1.0.0
- Fabric 1.1.X : 1.1.X
- Fabric 1.2.X : 1.2.X
- Fabric 1.3.X : 1.3.X
- Fabric 1.4.X : 1.4.X