#!/bin/bash

if [ ! -f /var/log/vmsetup ];
then
	apt-get -y update
	apt-get -y install curl vim libssl0.9.8

	wget http://packages.couchbase.com/releases/3.0.2/couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb -O couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb
	dpkg -i couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb

	sleep 20

	echo 'Initializing cluster...'
	/opt/couchbase/bin/couchbase-cli cluster-init -c 192.168.50.70:8091 --cluster-init-username=Administrator --cluster-init-password=password --cluster-init-ramsize=1024 -u Administrator -p password

	echo 'Initializing buckets...'
	/opt/couchbase/bin/couchbase-cli bucket-create -c 192.168.50.70:8091 --bucket=BuildManager --bucket-type=couchbase --bucket-ramsize=500 --bucket-replica=0 --bucket-password=password --enable-flush=1 -u Administrator -p password

	/opt/couchbase/bin/couchbase-cli server-list -c 192.168.50.70:8091 -u Administrator -p password
	/opt/couchbase/bin/couchbase-cli server-info -c 192.168.50.70:8091 -u Administrator -p password

	rm couchbase-server-enterprise_3.0.2-ubuntu12.04_amd64.deb

	# remove document size limit
	sed -i 's/return getStringBytes(json) > self.docBytesLimit;/return false/g' /opt/couchbase/lib/ns_server/erlang/lib/ns_server/priv/public/js/documents.js

	touch /var/log/vmsetup
fi