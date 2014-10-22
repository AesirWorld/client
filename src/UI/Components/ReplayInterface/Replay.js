/**
 * UI/Components/ReplayInterface/Replay.js
 *
 * Prepare replay interface
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author herenow
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
	var htmlText    = require('text!./Replay.html');
	var cssText     = require('text!./Replay.css');


	/**
	 * Create component
	 */
	var Replay = new UIComponent( 'Replay', htmlText, cssText );


	/**
	 * Initialize
	 */
	Replay.init = function Init()
	{
		this.replayTime = 0
		this.replayTotalTime = 0
		this.replayPaused = false

		// Preload images
		jQuery('style:first').append([
			'#Replay .control .play { background-image:url(' + require.toUrl('./play.png') + ');}',
			'#Replay .control .pause { background-image:url(' + require.toUrl('./pause.png') + ');}',
		].join('\n'));
	};
	
	
	/**
	 * Appended
	 */
	Replay.onAppend = function OnAppend()
	{
		console.log('ONAPPEND')
		this.ui.find('.message').fadeTo(0, 0.75)
		this.ui.find('.message').hide()
		this.ui.find('.controller').fadeTo(0, 0.75)
		this.ui.find('.controller .control .play').hide()

		// Effects
		this.ui.find('.controller .control .pause').fadeTo(0, 0.5)
		this.ui.find('.controller .control .play, .controller .control .pause').hover(function() {
			jQuery(this).stop().fadeTo('slow', 1)
		}, function() {
			jQuery(this).stop().fadeTo('slow', 0.5)
		})
	};


	/**
	 * On Remove
	 */
	Replay.onRemove = function OnRemove()
	{
		var self = this
		setTimeout(function() {
			self.append()
		}, 0)
	}

	/**
	 * Show error
	 */
	Replay.showError = function showError(msg) {
		this.ui.find('.message div').html(msg)
		this.ui.find('.message').show()
	}


	/**
	 * Stored component and return it
	 */
	return UIManager.addComponent(Replay);
});
