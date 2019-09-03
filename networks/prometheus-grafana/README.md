# Prometheus/Grafana

Caliper is able to send information to a Prometheus server, via a Push Gateway. The server is available for direct query via http queries or viewing with Grafana.

Caliper clients send information under the following labels:
 - caliper_tps
 - caliper_latency
 - caliper_send_rate
 - caliper_txn_submitted
 - caliper_txn_success
 - caliper_txn_failure
 - caliper_txn_pending

Each of the above items are tagged with the client number, test name, and test round

# Which Docker Compose?

There are multiple docker-compose.yml files:
 - docker-compose-bare.yml: used to only stand up a prometheus/grafana system that will scrape from the Prometheus Push Gateway
 - docker-compose-fabric.yml: as above with the adition of targeting exported fabric metrics on:
   - peer0.org1.example.com:9443
   - peer0.org2.example.com:9443

