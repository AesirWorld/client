/**
 * Network/SocketHelpers/SocketMock.js
 *
 * This is a mocked version of a socket.
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author herenow
 */

define(function(require)
{
	'use strict';
	
	
	/**
	 * Simulate opening a socket 
	 */
	function Socket()
	{
		var self = this;
	
		// Mock socket open on nextTick of event loop
		setTimeout(function() {
			self.onComplete(true);
		}, 0);

		// Mock data receivement
		this.receive = function receive(buffer) {
			self.onMessage(buffer);
		}
	}


	/**
	 * Sending packet to applet
	 *
	 * @param {ArrayBuffer} buffer
	 */
	Socket.prototype.send = function Send( buffer )
	{
		return;
	};


	/**
	 * Closing connection to server
	 */
	Socket.prototype.close = function Close()
	{
		return;
	};


	/**
	 * Export
	 */
	return Socket;
});
