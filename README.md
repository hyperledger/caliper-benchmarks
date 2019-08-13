# Hyperledger Caliper Benchmarks
This repository contains sample benchmarks that may be used by Caliper, a blockchain performance benchmark framework. For more information on Caliper, please see the [Caliper main repository](https://github.com/hyperledger/caliper/)

Associated performance reports, based on running these benchmarks, are published to the repository github pages.

## Repository Contents
The benchmarks contained within this repository are split into three directories:
1. **benchmarks**. Comprises the test configuration and callback files. The test configuration files describe the benchmark test parameters and also reference the callback files that are executed by Caliper clients during the benchmark. The Benchmark folder contains the following subfolders:
    - **api** Tests directed towards the API of a single target blockchain.
	- **samples** Tests directed towards the native samples provided by target blockchain platforms.
	- **scenario** Generic scenarios that are valid for all (supported) target blockchain platforms
2. **networks**. Comprises sample blockchain networks that may be used as target systems under test (SUT) for benchmarking purposes.
3. **src**. Comprises the source smart contract files that are deployed to the SUT and interacted with via the test callbacks located within the benchmarks folder. Each smart contract is held within its own folder, under the blockchain technology that the smart contract corresponds to. 

## Running a Benchmark
To run any of the benchmarks present in this repository, it is required to have installed [Hyperledger Caliper]((https://github.com/hyperledger/caliper/)), which is the intended consumer of all the contained files.

Steps:
1. Install the Caliper CLI - for details please see the [Caliper main repository](https://github.com/hyperledger/caliper/)
2. Clone this repository
3. Run a Caliper CLI command that targets one of the contained benchmarks. 
For instance, to run the benchmark that targets the Fabric Marbles sample against a Fabric v1.4.1 network, you would use the command: 
```bash
caliper benchmark run --caliper-benchconfig benchmarks/samples/fabric/marbles/config.yaml --caliper-networkconfig networks/fabric/fabric-v1.4.1/2org1peergoleveldb/fabric-go.yaml --caliper-workspace <path_to_caliper_benchmarks_root_directory>
```
