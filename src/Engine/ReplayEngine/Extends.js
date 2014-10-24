/**
 * Engine/ReplayEngine/Extends.js
 *
 * Core roBrowsers functionalities that need to be extended to fit the replay context.
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author herenow
 */


define(function( require )
{
	'use strict';


	/**
	 * Load dependencies
	 */
	var jQuery        = require('Utils/jquery');
	var UIManager     = require('UI/UIManager');


	/**
	 * Dont show prompt boxes
	 */
	UIManager.showPromptBox = function voidedPromptBox() {
		return
	}


	/**
	 * Exports
	 */
	return
});
