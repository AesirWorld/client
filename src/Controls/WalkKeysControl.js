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
	var glMatrix      = require('Vendors/gl-matrix');
	var vec2          = glMatrix.vec2;
	var mat2          = glMatrix.mat2;


	/**
	 * Key Listener
	 */
	jQuery(window).keydown(function( event )
	{
		if(event.which !== KEYS.UP && event.which !== KEYS.DOWN
		&& event.which !== KEYS.RIGHT && event.which !== KEYS.LEFT) {
			return true;
		}

		var x = 0, y = 0;
		var direction = [0];
		var rotate = [];

		// Get direction from keyboard
		direction[0] = (event.which === KEYS.RIGHT ? +1 :
		                event.which === KEYS.LEFT  ? -1 :
		                0);

		direction[1] = (event.which === KEYS.UP    ? +1 :
		                event.which === KEYS.DOWN  ? -1 :
		                0);

		// Initialize matrix, based on Camera direction
		mat2.identity(rotate);
		mat2.rotate(rotate, rotate, Camera.direction * 45 / 180 * Math.PI);

		// Apply matrix to vector
		vec2.transformMat2(direction, direction, rotate);

		// Round it
		direction[0] = Math.round(direction[0]);
		direction[1] = Math.round(direction[1]);

		// Hack to reverse diagonal directions
		// Demonstrate how it should be for the UP key
		if(event.which == KEYS.UP && direction[0] == 1 && direction[1] == 1) {
			direction[0] = -1;
			direction[1] = 1;
		}
		else if(event.which == KEYS.UP && direction[0] == -1 && direction[1] == 1) {
			direction[0] = 1;
			direction[1] = 1;
		}
		else if(event.which == KEYS.UP && direction[0] == -1 && direction[1] == -1) {
			direction[0] = 1;
			direction[1] = -1;
		}
		else if(event.which == KEYS.UP && direction[0] == 1 && direction[1] == -1) {
			direction[0] = -1;
			direction[1] = -1;
		}


		x = Math.round(Session.Entity.position[0] + 5 * direction[0]);
		y = Math.round(Session.Entity.position[1] + 5 * direction[1]);

		// Direction
		console.log('direction', direction)
		console.log('x', x, 'y', y)

		MapControl.onRequestWalk2(x, y);
		//event.stopImmediatePropagation();
		//return false;

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
