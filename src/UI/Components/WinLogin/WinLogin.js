/**
 * UI/Components/WinLogin/WinLogin.js
 *
 * WinLogin windows
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
	var FB			= require('facebook');
	var DB          = require('DB/DBManager');
	var Client      = require('Core/Client');
	var Preferences = require('Core/Preferences');
	var Renderer    = require('Renderer/Renderer');
	var KEYS        = require('Controls/KeyEventHandler');
	var UIManager   = require('UI/UIManager');
	var UIComponent = require('UI/UIComponent');
	var htmlText    = require('text!./WinLogin.html');
	var cssText     = require('text!./WinLogin.css');


	/** TEMP **/
	FB.init({
		appId: 582845158468483,
		status: false,
		//frictionlessRequests: true
	});


	/**
	 * Create WinLogin namespace
	 */
	var WinLogin = new UIComponent( 'WinLogin', htmlText, cssText );


	/**
	 * @var {Preferences}
	 */
	var _preferences = Preferences.get('WinLogin', {
		userID:     ''
	}, 1.0);


	/**
	 * @var {jQuery} username input
	 */
	var _inputUsername;


	/**
	 * @var {jQuery} userpass input
	 */
	var _inputPassword;


	/**
	 * @var {jQuery} save login ?
	 */
	var _buttonSave;


	/**
	 * Initialize win_login UI - Inherit from UIComponent
	 */
	WinLogin.init = function init()
	{

		var ui = this.ui;

		ui.css({
			top:  (Renderer.height - 300) / 2.0,
			left: (Renderer.width  - 280) / 2.0
		});

		this.draggable();

		// Save Elements
		_inputUsername = ui.find('.user').mousedown(function(event){ this.focus(); this.value = ''; event.stopImmediatePropagation(); return false; });
		_inputPassword = ui.find('.pass').mousedown(function(event){ this.focus(); this.value = ''; event.stopImmediatePropagation(); return false; });

		// Connect / Exit
		ui.find('.connect').click(connect);
		ui.find('.exit').click(exit);

		// Logo img
		ui.find('.logo').css('backgroundImage', 'url('+ require.toUrl('./logo.png') +')');

		// Facebook btn
		var fb = this.ui.find('.facebook');
		fb.css('backgroundImage', 'url('+ require.toUrl('./facebook-button.png') +')');
		fb.click(function() {
			FB.login(function(response) {
				var UID = response.authResponse.userID;
				var Token = response.authResponse.accessToken;

				// Connect
				WinLogin.onConnectionRequestFB( UID, Token );
			},{
				scope: 'email,user_birthday'
			});
		})

		FB.getLoginStatus(function(response) {
			console.log('winlogin.js', response)
		});
	};


	/**
	 * Once the component is on html - InHerit from UIComponent
	 */
	WinLogin.onAppend = function onAppend()
	{
		// Complete element
		_inputUsername.val(_preferences.userID);
		_inputPassword.val('');

		if (_preferences.userID.length) {
			_inputPassword.focus();
		}
		else {
			_inputUsername.focus();
		}
	};


	/**
	 * When player press key - InHerit from UIComponent
	 *
	 * @param {object} event
	 * @return {boolean}
	 */
	WinLogin.onKeyDown = function onKeyDown( event )
	{
		switch (event.which)
		{
			case KEYS.ENTER:
				connect();
				event.stopImmediatePropagation();
				return false;

			case KEYS.ESCAPE:
				exit();
				event.stopImmediatePropagation();
				return false;

			case KEYS.TAB:
				var button = document.activeElement === _inputUsername[0] ? _inputPassword : _inputUsername;
				button.focus().select();
				event.stopImmediatePropagation();
				return false;
		}

		return true;
	};

	/**
	 * When the user click on Exit, or pressed "Escape"
	 */
	function exit()
	{
		WinLogin.onExitRequest();
		return false;
	}


	/**
	 * When user click on the button "connect", or press "enter".
	 *
	 * @return {boolean} false
	 */
	function connect()
	{
		var user = _inputUsername.val();
		var pass = _inputPassword.val();

		// Store variable in localStorage
		_preferences.userID     = user;
		_preferences.save();

		// Connect
		WinLogin.onConnectionRequest( user, pass );
		return false;
	}


	/**
	 * Abstract function once user want to connect
	 */
	WinLogin.onConnectionRequest = function onConnectionRequest(/* user, pass */){};


	/**
	 * Abstract function when user want to exit
	 */
	WinLogin.onExitRequest = function onExitRequest(){};


	/**
	* Abstract function once user want to connect w/ facebook
	*/
	WinLogin.onConnectionRequestFB = function onConnectionRequestFB(/* userid, token */){};


	/**
	 * Create component based on view file and export it
	 */
	return UIManager.addComponent(WinLogin);
});
