# Fabric API Tests

This folder contains tests that target Fabric shim API methods that may be called within chaincode

## Read/Write Asset

The read/write asset benchmark is a more complex benchmark as it requires that you run a preload round or separate benchmark to load the SUT with a specific number of assets, it also provides the capability to delete those created assets.

The example shows a create, followed by read/writes, followed by a delete which abides by the following rules (which must be adhered to if you split these rounds into separate benchmarks)

1. For preload-assets and delete-preloaded assets your must ensure that the round uses TxNumber and that TxNumber matches the number of workers.
2. The number of workers must be the same for preload-assets, read-write-assets and delete-preloaded assets. If you want to use a different number of workers you need to delete the preloaded assets first and create them again.
3. The number of assets should be the same for preload-assets, read-write-assets and delete-preloaded assets. However you could use less assets for the read/write benchmark if required

Given that this will read and write to an asset, there are likely to be failures if the same key is read and updated (ie MVCC_READ_CONFLICT). This is an expected failure and if using the 2.4 binding will result in an error such as 

```
2022.09.26-10:25:06.322 error [caliper] [connectors/peer-gateway/PeerGateway]   Failed to perform submit transaction [readWriteAssets] using arguments [["client1_100_201","client1_100_0"],["client1_100_201","client1_100_0"],C],  with error: Error: Failed to submit trasaction with status code: 11
```

as status code of 11 is MVCC_READ_CONFLICT. These errors are expected and normal clients would handle this by perhaps resubmitting the transaction or replying that the record was updated and to refresh to review. Caliper currently will register this as a transaction failure but it's not entirely true.

### workload options

The following extra arguments (compared to the rest of asset benchmarks) can be seen in this example
```yaml
          readCount: 2
          write:
            count: 2
            writeMode: allread
```

- readCount defines the number of assets to be read
- count under write defines the number of assets to be written to
- writeMode has 3 options: allread, notread, random
  - allread means write to all the assets that were read (it accounts for differences in readCount and write count)
  - notread means it will explicitly not write the the assets that were read
  - random means that no checks are made it randonly selects assets to read/write and this set may are may not contain the same asset to read and write to
