# Prometheus/Grafana

Caliper is able to send information to a Prometheus server, via a PushGateway. The server is available for direct query via http queries or viewing with Grafana.

Caliper clients send information under the following labels:
 - caliper_tps
 - caliper_latency
 - caliper_send_rate
 - caliper_txn_submitted
 - caliper_txn_success
 - caliper_txn_failure
 - caliper_txn_pending

Each of the above items are tagged with the client number, test name, and test round

