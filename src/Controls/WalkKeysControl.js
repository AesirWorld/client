/**
 * Controls/WalkKeysControl.js
 *
 * Walk using arrow keys
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function(require)
{
	'use strict';


	/**
	 * Dependencies
	 */
	var Client        = require('Core/Client');
	var jQuery        = require('Utils/jquery');
	var KEYS          = require('Controls/KeyEventHandler');
	var MapControl    = require('Controls/MapControl');
	var Mouse         = require('Controls/MouseEventHandler');
	var Session       = require('Engine/SessionStorage');
	var PACKET        = require('Network/PacketStructure');
	var Camera        = require('Renderer/Camera');


	/**
	 * Key Listener
	 */
	jQuery(window).keydown(function( event )
	{
		var x = 0, y = 0;
		var mul_x = 0, mul_y = 0;

		switch(event.which) {
			case KEYS.UP:
				// Adjust up direction based on camera direction
				switch(Camera.direction) {
					case 0:
						mul_x = 0;
						mul_y = 1;
						break;
					case 1:
						mul_x = -1;
						mul_y = 1;
						break;
					case 2:
						mul_x = -1;
						mul_y = 0;
						break;
					case 3:
						mul_x = -1;
						mul_y = -1;
						break;
					case 4:
					case -4:
						mul_x = 0;
						mul_y = -1;
						break;
					case -3:
						mul_x = 1;
						mul_y = -1;
						break;
					case -2:
						mul_x = 1;
						mul_y = 0;
						break;
					case -1:
						mul_x = 1;
						mul_y = 1;
						break;
				}

				x = Math.round(Session.Entity.position[0] + 5 * mul_x);
				y = Math.round(Session.Entity.position[1] + 5 * mul_y);

				MapControl.onRequestWalk2(x, y);
				event.stopImmediatePropagation();
				return false;
			case KEYS.DOWN:
				// Adjust down direction based on camera direction
				switch(Camera.direction) {
					case 0:
						mul_x = 0;
						mul_y = -1;
						break;
					case 1:
						mul_x = 1;
						mul_y = -1;
						break;
					case 2:
						mul_x = 1;
						mul_y = 0;
						break;
					case 3:
						mul_x = 1;
						mul_y = 1;
						break;
					case 4:
					case -4:
						mul_x = 0;
						mul_y = 1;
						break;
					case -3:
						mul_x = -1;
						mul_y = 1;
						break;
					case -2:
						mul_x = -1;
						mul_y = 0;
						break;
					case -1:
						mul_x = -1;
						mul_y = -1;
						break;
				}

				x = Math.round(Session.Entity.position[0] + 5 * mul_x);
				y = Math.round(Session.Entity.position[1] + 5 * mul_y);

				MapControl.onRequestWalk2(x, y);
				event.stopImmediatePropagation();
				return false;
			case KEYS.RIGHT:
				// Adjust right direction based on camera direction
				switch(Camera.direction) {
					case 0:
						mul_x = 1;
						mul_y = 0;
						break;
					case 1:
						mul_x = 1;
						mul_y = 1;
						break;
					case 2:
						mul_x = 0;
						mul_y = 1;
						break;
					case 3:
						mul_x = -1;
						mul_y = 1;
						break;
					case 4:
					case -4:
						mul_x = -1;
						mul_y = 0;
						break;
					case -3:
						mul_x = -1;
						mul_y = -1;
						break;
					case -2:
						mul_x = 0;
						mul_y = -1;
						break;
					case -1:
						mul_x = 1;
						mul_y = -1;
						break;
				}

				x = Math.round(Session.Entity.position[0] + 5 * mul_x);
				y = Math.round(Session.Entity.position[1] + 5 * mul_y);

				MapControl.onRequestWalk2(x, y);
				event.stopImmediatePropagation();
				return false;
			case KEYS.LEFT:
				// Adjust left direction based on camera direction
				switch(Camera.direction) {
					case 0:
						mul_x = -1;
						mul_y = 0;
						break;
					case 1:
						mul_x = -1;
						mul_y = -1;
						break;
					case 2:
						mul_x = 0;
						mul_y = -1;
						break;
					case 3:
						mul_x = 1;
						mul_y = -1;
						break;
					case 4:
					case -4:
						mul_x = 1;
						mul_y = 0;
						break;
					case -3:
						mul_x = 1;
						mul_y = 1;
						break;
					case -2:
						mul_x = 0;
						mul_y = 1;
						break;
					case -1:
						mul_x = -1;
						mul_y = 1;
						break;
				}

				x = Math.round(Session.Entity.position[0] + 5 * mul_x);
				y = Math.round(Session.Entity.position[1] + 5 * mul_y);

				MapControl.onRequestWalk2(x, y);
				event.stopImmediatePropagation();
				return false;
		}

		return true;
	});

	jQuery(window).keyup(function( event )
	{
		switch(event.which) {
			case KEYS.UP:
			case KEYS.DOWN:
			case KEYS.RIGHT:
			case KEYS.LEFT:
				MapControl.onRequestStopWalk();
				event.stopImmediatePropagation();
				return false;
		}

		return true;
	});


	/**
	 * Initiate methods
	 */
	var WalkKeys = {};


	/**
	 * Exports
	 */
	return WalkKeys;
});
