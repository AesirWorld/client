/**
* App/Replay.js
*
* Start a hacked game engine
* To replay packet buffers
*
* This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
*
* @author herenow 
*/

// Errors Handler (hack)
require.onError = function (err) {
	'use strict';

	if (require.defined('UI/Components/Error/Error')) {
		require('UI/Components/Error/Error').addTrace(err);
		return;
	}

	require(['UI/Components/Error/Error'], function( Errors ){
		Errors.addTrace(err);
	});
};

require( {
	baseUrl: './src/',
	paths: {
		text:   'Vendors/text.require',
		jquery: 'Vendors/jquery-1.9.1',
		facebook: 'Vendors/facebook-sdk' //part of the api
	},
	shim: {
		'facebook' : {
			exports: 'FB'
		}
	}
},
	['Engine/GameEngine', 'Core/Context'],
	function( GameEngine, Context) {
		'use strict';

		// Setup context
		Context.Is.REPLAY = true
	
		GameEngine.init();

		if (!Context.Is.APP) {
			window.onbeforeunload = function() {
				return 'Are you sure to exit roBrowser ?';
			};
		}
	}
);
