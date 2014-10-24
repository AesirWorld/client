/**
 * Core/ApiDriver.js 
 *
 * Generic AesirWorld's API driver
 *
 * @author herenow 
 */

define([
	'Utils/jquery'
],
function(
	jQuery
)
{
	"use strict";
	

	/**
	 * API Constructor
	 */
	var API = function Connect(url) {
		if(url) {
			// Remove trailling slash
			if( url.slice(-1) == '/') {
				url = url.substring(0, url.length - 1)
			}
			this.baseUrl = url
		}
	}
	

	/**
	 * API base url
	 */
	API.prototype.baseUrl = ''


	/**
	 * API service calls wrapper
	 */
	API.prototype.call = function Call(props, callback)
	{
		var method	= props.method
		var path	= props.path
		var data	= props.data
		var req		= {}
	
		// Append slash if not present
		if( path.substring(0, 1) != '/' ) {
			path += '/'
		}
		
		req.type		= method
		req.dataType	= 'json'
		req.url			= this.baseUrl + path
		
		if( data ) {
			req.data	= data
		}
		
		if( callback ) {
			req.success	= callback
			req.error	= callback
		}
		
		return jQuery.ajax(req)
	}


	/**
	 * Request replay data
	 *
	 * GET /v1/replay/:UID
	 */
	API.prototype.getReplay = function getReplay(uid, callback) {
		this.call({
			method: 'GET',
			path:   '/v1/replay/' + uid,
		}).done(function(data) {
			callback(null, data)
		}).fail(function(jqXHR, textStatus, errorThrown) {
			callback({
				error: errorThrown,
				code: jqXHR.statusCode().status,
			})
		})
	}
	
	
	/**
	 * Export
	 */
	return API
});
