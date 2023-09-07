
# Besu Networks
Ensure you have all the necessary prerequisites for [Caliper](https://github.com/hyperledger/caliper/) and [Hyperledger Besu](https://besu.hyperledger.org/stable/private-networks/get-started/install)

# Running the Besu Network Benchmarks
Steps to setup an environment to use the caliper-benchmark with the Besu network.
 - Create a directory for this environment - eg `mkdir besu-benchmarks`
 - Change to this directory - eg `cd besu-benchmarks`
 - Clone caliper-benchmarks (ensure that it is created inside the directory you created above)
 ```bash
 git clone https://github.com/hyperledger/caliper-benchmarks
 ```
 - Change into the caliper-benchmarks directory
 ```bash
 cd caliper-benchmarks
 ```
- Install the latest version of Caliper
```bash
npm  install  --only=prod  @hyperledger/caliper-cli
```
- Bind Caliper to latest version of Besu
```bash
npx caliper bind --caliper-bind-sut besu:latest
```
If you want to bind to a different version of Besu you can replace the `latest` with one of the following SUT name and SDK version combinations that are supported:

-   **besu**:  `1.3.2`,  `1.3`,  `1.4`

Make sure to unbind your current binding (for example if you are bound the `besu:latest` unbind first with `caliper unbind --caliper-bind-sut besu:latest`) before binding to the whichever version you want to.

# Benchmark Execution
Ensure that you are in the `caliper-benchmarks` directory. We can choose from several benchmarks to run. 
Below are the examples of how to run a benchmark on the simple smart contract, an ERC-20 smart contract and an ERC-721 smart contract on the Besu 1node-clique network.

- Simple Smart Contract 
 ```bash
npx caliper launch manager \ 
    --caliper-benchconfig benchmarks/scenario/ERC-20/config.yaml \ 
    --caliper-networkconfig networks/besu/1node-clique/networkconfig.json \
    --caliper-workspace .
```

- ERC-20 Smart Contract
```bash
npx caliper launch manager \
    --caliper-benchconfig benchmarks/scenario/simple/ERC-20/config.yaml \
    --caliper-networkconfig networks/besu/1node-clique/erc20networkconfig.json \
    --caliper-workspace .
```

- ERC-721 Smart Contract
```bash
npx caliper launch manager \
    --caliper-benchconfig benchmarks/scenario/simple/ERC-721/config.yaml \
    --caliper-networkconfig networks/besu/1node-clique/erc721networkconfig.json \
    --caliper-workspace .
```