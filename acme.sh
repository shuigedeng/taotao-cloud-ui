## api
#acme.sh --issue -d api.taotaocloud.top -w /opt/openresty/business/taotao-cloud-api
#
#acme.sh --install-cert -d api.taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644913566006_api.taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644913566006_api.taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## datav
acme.sh --issue -d datav.taotaocloud.top -w /opt/openresty/business/taotao-cloud-datav

acme.sh --install-cert -d datav.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644913503096_datav.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644913503096_datav.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## manager
acme.sh --issue -d manager.taotaocloud.top -w /opt/openresty/business/taotao-cloud-manager

acme.sh --install-cert -d manager.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644913661842_manager.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644913661842_manager.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## open
acme.sh --issue -d open.taotaocloud.top -w /opt/openresty/business/taotao-cloud-open

acme.sh --install-cert -d open.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644914860954_open.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644914860954_open.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## backend
acme.sh --issue -d backend.taotaocloud.top -w /opt/openresty/business/taotao-cloud-backend

acme.sh --install-cert -d backend.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644913524304_backend.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644913524304_backend.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## docs
#acme.sh --issue -d docs.taotaocloud.top -w /opt/openresty/business/taotao-cloud-docs
#
#acme.sh --install-cert -d docs.taotaocloud.top \
#--key-file /opt/openresty/cert/8784399_docs.taotaocloud.top.key \
#--fullchain-file /opt/openresty/cert/8784399_docs.taotaocloud.top.pem \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## m
#acme.sh --issue -d m.taotaocloud.top -w /opt/openresty/business/taotao-cloud-mall
#
#acme.sh --install-cert -d m.taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644913643890_m.taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644913643890_m.taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## qodana
#acme.sh --issue -d qodana.taotaocloud.top -w /opt/openresty/business/taotao-cloud-qodana
#
#acme.sh --install-cert -d qodana.taotaocloud.top \
#--key-file /opt/openresty/cert/8030494_qodana.taotaocloud.top.key \
#--fullchain-file /opt/openresty/cert/8030494_qodana.taotaocloud.top.pem \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## blog
acme.sh --issue -d blog.taotaocloud.top -w /opt/openresty/business/taotao-cloud-blog

acme.sh --install-cert -d blog.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644913546265_blog.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644913546265_blog.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## gateway
#acme.sh --issue -d gateway.taotaocloud.top -w /opt/openresty/business/taotao-cloud-gateway
#
#acme.sh --install-cert -d gateway.taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644914883193_gateway.taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644914883193_gateway.taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## merchant
acme.sh --issue -d merchant.taotaocloud.top -w /opt/openresty/business/taotao-cloud-merchant

acme.sh --install-cert -d merchant.taotaocloud.top \
--key-file /opt/openresty/cert/scs1644914838970_merchant.taotaocloud.top_server.key \
--fullchain-file /opt/openresty/cert/scs1644914838970_merchant.taotaocloud.top_server.crt \
--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

### log
#acme.sh --issue -d log.taotaocloud.top -w /opt/openresty/business/taotao-cloud-log
#
#acme.sh --install-cert -d log.taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644913585495_log.taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644913585495_log.taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## merchant
#acme.sh --issue -d mp.taotaocloud.top -w /opt/openresty/business/taotao-cloud-mp
#
#acme.sh --install-cert -d mp.taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644913625034_mp.taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644913625034_mp.taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"

## www
#acme.sh --issue -d taotaocloud.top -w /opt/openresty/business/taotao-cloud
#
#acme.sh --install-cert -d taotaocloud.top \
#--key-file /opt/openresty/cert/scs1644913475908_taotaocloud.top_server.key \
#--fullchain-file /opt/openresty/cert/scs1644913475908_taotaocloud.top_server.crt \
#--reloadcmd     "openresty -p /opt/openresty -c conf/nginx.conf -s reload"
