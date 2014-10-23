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
			'#Replay .control .replay { background-image:url(' + require.toUrl('./replay.png') + ');}',
			'#Replay .controller .decoration { background-image:url(' + require.toUrl('./devilling.png') + ');}',
		].join('\n'));
	};
	
	
	/**
	 * Appended
	 */
	Replay.onAppend = function OnAppend()
	{
		var message = this.ui.find('.message')
		var paused_overlay = this.ui.find('.paused_overlay')
		var play = this.ui.find('.controller .control .play')
		var pause = this.ui.find('.controller .control .pause')
		var replay = this.ui.find('.controller .control .replay')

		message.fadeTo(0, 0.75)
		message.hide()
		paused_overlay.fadeTo(0, 0.85)
		paused_overlay.hide()
		this.ui.find('.controller').fadeTo(0, 0.85)
	
		// Hide		
		play.hide()
		pause.hide()
		replay.hide()

		// Binds
		play.click(Replay.onPlay.bind(this))
		pause.click(Replay.onPause.bind(this))
		replay.click(Replay.onReplay.bind(this))
	};

	/**
	 * Show a state control button and hide the rest
	 */
	Replay.showButton = function showButton(name) {
		var play = this.ui.find('.controller .control .play')
		var pause = this.ui.find('.controller .control .pause')
		var replay = this.ui.find('.controller .control .replay')

		// Hide all
		play.hide()
		pause.hide()
		replay.hide()
		
		switch(name) {
			case "play":
				play.show()
				break
			case "pause":
				pause.show()
				break
			case "replay":
				replay.show()
				break
		}	
	}
	
	/**
	 * Setup paused interface
	 */
	Replay.pause = function pause() {
		this.ui.find('.paused_overlay').fadeIn('fast')
		this.showButton("play")	
	}

	/**
	 * Setup play interface
	 */
	Replay.play = function play() {
		this.ui.find('.paused_overlay').fadeOut('fast')	
		this.showButton("pause")
	}

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
	 * Show message
	 */
	Replay.showMessage = function showMessage(msg) {
		this.ui.find('.message div').html(msg)
		this.ui.find('.message').show()
	}

	/**
	 * Show error
	 */
	Replay.showError = Replay.showMesage 

	/**
	 * End replay
	 */
	Replay.showEnd = function showEnd() {
		this.ui.find('.paused_overlay').fadeIn('slow')
		this.showMessage('End of replay.')
		this.updateProgress(100)
	}

	/**
	 * Update replat current time
	 */
	Replay.updateTime = function updateTime(currentSec) {
		var seconds = currentSec % 60 
		var minutes = Math.floor(currentSec / 60)

		if(seconds < 10) seconds = "0" + seconds
		if(minutes < 10) minutes = "0" + minutes
		
		this.ui.find('.time').html(minutes + ":" + seconds)
	}


	/**
	 * UI update progress bar
	 */
	Replay.updateProgress = function(percentage) {
		this.ui.find('.progress .fill').width(percentage + "%")
		this.ui.find('.progress .decoration').width(percentage + "%")
	}


	/**
	 * Abstract functions
	 * They should be replaced by some other module
	 */
	Replay.onPause = function onClickPause() {}
	Replay.onPlay  = function onClickPlay() {}
	Replay.onReplay = function onClickReplay() {}

	/**
	 * Stored component and return it
	 */
	return UIManager.addComponent(Replay);
});
