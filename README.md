meteor-load-balancing
=====================

Example application demonstrating load balancing a meteor app using HAProxy


Open 5 terminal windows:

  * haproxy -f haproxy.cfg
  * ./run
  * ./run 2
  * ./run 3
  * ./run 4

Open http://localhost:3000/ in some browsers.

