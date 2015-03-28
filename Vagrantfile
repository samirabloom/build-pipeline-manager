# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "hashicorp/precise64"
  config.vm.boot_timeout = 600

  # fix "stdin: is not a tty" error
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  config.vm.define "couchbase" do |couchbase|
    couchbase.vm.hostname = "gamecouch"
    couchbase.vm.network "private_network", ip: "192.168.50.70"
    couchbase.vm.provision :shell, :path => "bootstrap_game_couch.sh"
    couchbase.vm.provider :virtualbox do |vb|
      vb.memory = 2048
    end
  end

end