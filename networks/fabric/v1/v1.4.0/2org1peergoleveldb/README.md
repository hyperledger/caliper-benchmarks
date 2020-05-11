## Platform configurations

The following network configuration files are available for the different platforms, containing the listed chaincodes that will be deployed (installed and instantiated).

### Composer
* `composer(-tls).json`
  * `basic-sample-network` 
  * `vehicle-lifecycle-network`

### Fabric
* `fabric-go(-tls).json` (__golang__ implementations) 
  * `marbles` __without__ CouchDB index metadata and rich query support.
  * `drm`
  * `simple`
  * `smallbank`
* `fabric-node(-tls).json` (__Node.JS__ implementations) 
  * `marbles` __without__ CouchDB index metadata and rich query support.
  * `simple`
