/**
 * Engine/ReplayEngine.js
 *
 * Game replay processor 
 * Process game replays and control its current buffer
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author herenow
 */

define(function(require)
{
	'use strict';

	/**
	 * Dependencies
	 */
	var ApiDriver		 = require('Core/ApiDriver')
	var MapEngine		 = require('Engine/MapEngine')
	var BinaryReader	 = require('Utils/BinaryReader')
	var Network          = require('Network/NetworkManager')
	var MapRenderer		 = require('Renderer/MapRenderer')
	var Session          = require('Engine/SessionStorage')
	var Configs          = require('Core/Configs');
	var Loading			 = require('UI/Components/Loading/Loading')
	var ReplayInterface	 = require('UI/Components/ReplayInterface/Replay')


	/**
	 * @namespace
	 */
	var ReplayEngine = {}

	
	/**
	 * JSON containing all replay data and state information
	 */
	ReplayEngine.replayData = {}


	/**
	 * Connect to the API
	 */
	ReplayEngine.API = new ApiDriver( Configs.get("apiServer") )

	
	/**
	 * Setup replay enviroment
	 */
	ReplayEngine.init = function init() {
		// Replay uid from url hash
		var uid = window.location.hash.substring(1)

		if(!uid) {
			this.showError("No replay ID specified, check your url.")
			return
		}

		// Loading ui
		Loading.append()
		ReplayInterface.append()
	
		// Retrive replay data from api
		var self = this
		var API  = this.API

		API.getReplay(uid, function(err, data) {
			if(err) {
				switch(err.code) {
					case 404:
						self.showError("Replay not found.")
						break	
					case 500:
						self.showError("Replay currently unavailable, try again later.")
						break
					default:
						self.showError("Ops, something went wrong while trying to find your replay, please try again later.")
						break
				}
				return
			}
			
			self.replayData = data
			self.loadBuffer()
		})
	}


	/**
	 * Load replay buffer
	 */
	ReplayEngine.loadBuffer = function load() {
		var replay_uri = this.replayData.replay_buffer_uri
		var self = this
		if(! replay_uri) {
			this.showError("Replay buffer couldn't be found.")
			return
		}

		// Retrieve
		var xhr = new XMLHttpRequest()
		xhr.open('GET', replay_uri, true)
		xhr.responseType = 'arraybuffer'
		xhr.onload = function(){
			if (xhr.status == 200) {
				self.replayBuffer = xhr.response
				self.startReplay()
			}
			else {
				self.showError("Replay buffer couldn't be found on the server.'")	
			}
		}
		xhr.onerror = function(){
			self.showError("Failed trying to fetch replay buffer from the server.")
		}

		// Can throw an error if not connected to internet
		try {
			xhr.send()
		} catch(e) {
			this.showerror("No internet connection?")	
		}
	}

	/**
	 * Start replay
	 */
	ReplayEngine.startReplay = function start() {
		var buffer = this.replayBuffer
		var self = this
		
		// Finish loading
		Loading.remove()
		
		// Parse replay
		this.fp = new BinaryReader(buffer)

		// Validate state information
		if(typeof this.replayData.state === 'undefined') {
			this.showError("State information about this replay not found.")
			return
		}

		// Load character state
		Session.Character = this.replayData.state

		// Setup sex, gid, aid
		Session.Sex = (this.replayData.state.sex == 'F' ? 0 : 1) 
		Session.Character.sex = Session.Sex
		Session.GID = this.replayData.state.GID
		Session.Character.GID = this.replayData.account_id
		Session.AID = this.replayData.account_id

		// Load state
		if(this.replayData.state.startMap.slice(-4) != '.gat') {
			this.replayData.state.startMap += '.gat'
		}

		var startMap = this.replayData.state.startMap

		if(! startMap) {
			this.showError("Missing start map state data.")
			return
		}
		
		MapEngine.init('0.0.0.0', '0', startMap)

		// Intercept MapRenderer.onLoad func from MapEngine
//		var nextFnc = MapRenderer.onLoad
		
//		MapRenderer.onLoad = function extendedMapRendererOnLoad() {
			// Replay controller
			// Start at 1x speed
			self.playbackResume(1)
		
			// Give event back
//			MapRenderer.onLoad = nextFnc
//			nextFnc()
//		}
	}


	/**
	 * Replay timer & properties
	 */
	ReplayEngine.playbackTimer = null
	ReplayEngine.playbackSpeed = 128
	ReplayEngine.elapsedTime = 0
	ReplayEngine.lastFrameTick = 0
	ReplayEngine.previousFrameOffset = 0
	ReplayEngine.playbackIsPaused = true


	/**
	 * Replay playback controller
	 */
	ReplayEngine.playbackResume = function playbackResume() {
		if(this.playbackIsPaused === false) {
			return
		}
		
		this.playbackIsPaused = false

		// Recursive function
		this.playbackNext()
	}


	/**
	 * Set replay speed
	 */
	ReplayEngine.playbackSetSpeed = function playbackSetSpeed(speed) {
		this.playbackSpeed = speed
	}


	/**
	 * Pause playback
	 */
	ReplayEngine.playbackPause = function playbackPause() {
		if(this.playbackIsPaused === true) {
			console.log('PLAYBACK ALREADY PAUSED')
			return
		}

		if(this.playbackTimer) {
			clearTimeout(this.playbackTimer) // imediate stop of replay
			this.movePreviousFrame() // move back to previous frame
		}

		console.log("PAUSING PLAYBACK")

		this.playbackIsPaused = true
	}


	/**
	 * Replay playbacker
	 */
	var playbackNextID = 0
	ReplayEngine.playbackNext = function playbackNext(id) {
		var fp = this.fp

		var wid = id || ++playbackNextID
	
		// Check if there are frames to be read
		if(fp.tell() >= fp.length) {
			this.replayEnd()
			return
		}

		// Read frame
		var frame = this.nextFrame()

		// TODO: buf fix :(
		// For some reason the replay buffer is ending with lots of empty bytes
		if(frame.tick === 0 || frame.buffer.byteLength === 0) {
			console.error("Unexpected end of replay file")
			this.replayEnd()
			return
		}
			
		var delay = frame.tick - this.lastFrameTick

		this.elaspedTime = Math.floor(frame.tick / 1000)

		this.lastFrameTick = frame.tick

		console.log('#', wid, 'elapsedTime', this.elaspedTime, 'frame.tick', frame.tick, 'nextDelay', delay, 'speed')

		var self = this

		delay = delay / this.playbackSpeed // Adjust replay spede

		this.playbackTimer = this.playFrame(frame.buffer, delay, function() {
			self.playbackNext(wid)
		})
	}
	

	/**
	 * Get next replay frame
	 * Binary format:
	 * <4 bytes> for time tick
	 * <4 bytes> payload length
	 * <payload>
	 *
	 * @return
	 * {
	 *   tick: interval in millisecodns this frame should be played.
	 *   buffer: raw network replay buffer
	 * }
	 */
	ReplayEngine.nextFrame = function nextFrame() {
		var fp = this.fp

		this.previousFrameOffset = fp.offset

		var tick = fp.readULong()
		var payload_size = fp.readULong()
		var payload = fp.buffer.slice(fp.offset, fp.offset + payload_size)

		fp.seek(payload_size, SEEK_CUR); // move

		return {
			tick: tick,
			buffer: payload
		}
	}


	/**
	 * Move back to previous frame
	 * Once back, you can use this.nextFrame again
	 *
	 * @return moved_bytes
	 */
	ReplayEngine.movePreviousFrame = function moveBack2LastFrame() {
		var fp = this.fp
		var currentOffset = fp.offset

		fp.seek(this.previousFrameOffset)

		return this.previousFrameOffset
	}

	/**
	 * Play a givenf frame
	 *
	 * @param {buffer} raw packet buffer
	 * @param {delay} timeout delay
	 * @param {callback}
	 */
	ReplayEngine.playFrame = function playFrame(buffer, delay, callback) {
		var self = this
		return setTimeout(function playFrameBuffer() {
			if(self.playbackIsPaused) {
				console.log("------- TRYING TO PLAYBACK WHILE PAUSED ------- ")
				return
			}

			console.log("Sending replay packet")
			Network.receive(buffer)
			callback()
		}, delay)
	}

	
	/**
	 * Print error to ui
	 */
	ReplayEngine.showError = function showError(err) {
		Loading.remove()
		console.error(err)
		ReplayInterface.showError(err)
	}


	/**
	 * End replay on ui
	 */
	ReplayEngine.replayEnd = function replayEnd() {
		clearTimeout(this.playbackTimer)
		console.log("END OF REPLAY")
		ReplayInterface.showError("End of replay.")
	}

	window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
		ReplayEngine.playbackNext()	
		return true
	}
	/**
	 * Export
	 */
	return ReplayEngine;
});
