/**
 * UI/Components/Loading/Loading.js
 *
 * Loading, simple full screen loading
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */
define(function(require)
{
	"use strict";


	/**
	 * Dependencies
	 */
	var jQuery      = require('Utils/jquery');
	var UIManager   = require('UI/UIManager');
	var UIComponent = require('UI/UIComponent');
	var htmlText    = require('text!./Loading.html');
	var cssText     = require('text!./Loading.css');
	var Context     = require('Core/Context');


	/**
	 * Create Intro component
	 */
	var Loading = new UIComponent( 'Loading', htmlText, cssText );


	/**
	 * Initialize
	 */
	Loading.init = function Init()
	{
	};
	
	
	/**
	 * Appended
	 */
	Loading.onAppend = function OnAppend()
	{
		this.ui.find('.overlay.loading').show().animate({opacity:1}, 200);
	};
	

	/**
	 * Stored component and return it
	 */
	return UIManager.addComponent(Loading);
});
