# Hyperledger Blockchain Technology Performance

This site represents a collaborative collection and presentation of Hyperledger Blockchain technology performance reports, using the metrics defined within the Hyperledger Performance and Scale Working Group's white paper titled
[Hyperledger Blockchain Performance Metrics](https://www.hyperledger.org/resources/publications/blockchain-performance-metrics) and generated using Hyperledger Caliper.

Within this site you will find performance reports for Hyperledger Blockchain technologies covering:

 - API tests: Deep dive investigation into the performance implications of API useage for a specific Hyperledger technology
 - Sample tests: A test that is focussed on a sample provided for a specific Hyperledger technology
 - Scenario tests: A test that involves the completion of a task, and is applicable to all Hyperledger technologies

All test resources used to generate the contained reports are available within the [Caliper Benchmarks repository](https://github.com/hyperledger/caliper-benchmarks) 

## Notes
The performance information is obtained by measuring the transaction throughput for different types of smart contract transactions. The term “transaction” is used in a generic sense, and refers to any interaction with a smart contract, regardless of the complexity of the subsequent interaction(s) with the blockchain platform under test.

The data contained in listed reports were measured in a controlled environment, results obtained in other environments might vary. For more details on the environments used, see the resources section at the end of all available reports.
The performance data cannot be compared across versions of a blockchain technology, as testing hardware and environments may be significantly different. The testing contents and processing methodologies may have also changed between performance reports, and so these cannot be compared.
