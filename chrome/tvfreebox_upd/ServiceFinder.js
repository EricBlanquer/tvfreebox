/**
 * Construct a new ServiceFinder. This is a single-use object that does a DNS
 * multicast search on creation.
 * @constructor
 * @param {function} callback The callback to be invoked when this object is
 *                            updated, or when an error occurs (passes string).
 */
var ServiceFinder = function(callback) {
  this.callback_ = callback;
  this.byService_ = {};
  // Set up receive handlers.
  this.onReceiveListener_ = this.onReceive_.bind(this);
  chrome.sockets.udp.onReceive.addListener(this.onReceiveListener_);
  this.onReceiveErrorListener_ = this.onReceiveError_.bind(this);
  chrome.sockets.udp.onReceiveError.addListener(this.onReceiveErrorListener_);
  ServiceFinder.forEachAddress_(function(address, error) {
    if (error) {
      this.callback_(error);
      return true;
    }
    if (address.indexOf(':') != -1) {
      // TODO: ipv6.
      console.log('IPv6 address unsupported', address);
      return true;
    }
    console.log('Broadcasting to address', address);
    ServiceFinder.bindToAddress_(address, function(socket) {
      if (!socket) {
        this.callback_('could not bind UDP socket');
        return true;
      }
      // Broadcast on it.
      this.broadcast_(socket, address);
    }.bind(this));
  }.bind(this));
  // After a short time, if our database is empty, report an error.
  setTimeout(function() {
    if (!Object.keys(this.byService_).length) {
      this.callback_('no mDNS services found!');
    }
  }.bind(this), 10 * 1000);
};

/**
 * Invokes the callback for every local network address on the system.
 * @private
 * @param {function} callback to invoke
 */
ServiceFinder.forEachAddress_ = function(callback) {
  chrome.system.network.getNetworkInterfaces(function(networkInterfaces) {
    if (!networkInterfaces.length) {
      callback(null, 'no network available!');
      return true;
    }
    networkInterfaces.forEach(function(networkInterface) {
      callback(networkInterface['address'], null);
    });
  });
};

/**
 * Creates UDP socket bound to the specified address, passing it to the
 * callback. Passes null on failure.
 * @private
 * @param {string} address to bind to
 * @param {function} callback to invoke when done
 */
ServiceFinder.bindToAddress_ = function(address, callback) {
  chrome.sockets.udp.create({}, function(createInfo) {
    chrome.sockets.udp.bind(createInfo['socketId'], address, 0,
        function(result) {
      callback((result >= 0) ? createInfo['socketId'] : null);
    });
  });
};

/**
 * Handles an incoming UDP packet.
 * @private
 */
ServiceFinder.prototype.onReceive_ = function(info) {
console.log('receive', info);
  // Update our local database.
  // TODO: Resolve IPs using the dns extension.
  var packet = DNSPacket.parse(info.data);
  packet.each('an', 12, function(rec) {
    var ptr = rec.asName();
	if (ptr == '_hid') {
		if (!this.byService_[ptr]) {
			this.byService_[ptr] = {};
		}
		this.byService_[ptr][info.remoteAddress] = info;
	}
  }.bind(this));
  this.callback_();
};

/**
 * Handles network error occured while waiting for data.
 * @private
 */
ServiceFinder.prototype.onReceiveError_ = function(info) {
  this.callback_(info.resultCode);
  return true;
}

/**
 * Broadcasts for services on the given socket/address.
 * @private
 */
ServiceFinder.prototype.broadcast_ = function(sock, address) {
  var packet = new DNSPacket();
  packet.push('qd', new DNSRecord('_services._dns-sd._udp.local', 12, 1));
  var raw = packet.serialize();
  chrome.sockets.udp.send(sock, raw, '224.0.0.251', 5353, function(sendInfo) {
    if (sendInfo.resultCode < 0) {
      this.callback_('Could not send data to:' + address);
	}
  });
};

ServiceFinder.prototype.shutdown = function() {
  // Remove event listeners.
  chrome.sockets.udp.onReceive.removeListener(this.onReceiveListener_);
  chrome.sockets.udp.onReceiveError.removeListener(this.onReceiveErrorListener_);
  // Close opened sockets.
  chrome.sockets.udp.getSockets(function(sockets) {
    sockets.forEach(function(sock) {
      chrome.sockets.udp.close(sock.socketId);
    });
  });
}