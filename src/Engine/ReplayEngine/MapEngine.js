/**
 * Engine/ReplayEngine/MapEngine.js
 *
 * Mocked version of the Engine/MapEngine.js to fit the Replay context.
 * Manage Map server
 *
 * This file is part of ROBrowser, Ragnarok Online in the Web Browser (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

define(function( require )
{
	'use strict';


	/**
	 * Load dependencies
	 */
	var jQuery           = require('Utils/jquery');
	var DB               = require('DB/DBManager');
	var SoundManager     = require('Audio/SoundManager');
	var BGM              = require('Audio/BGM');
	var Events           = require('Core/Events');
	var Session          = require('Engine/SessionStorage');
	var Network          = require('Network/NetworkManager');
	var PACKET           = require('Network/PacketStructure');
	var Renderer         = require('Renderer/Renderer');
	var Context          = require('Core/Context');
	var Camera           = require('Renderer/Camera');
	var MapRenderer      = require('Renderer/MapRenderer');
	var EntityManager    = require('Renderer/EntityManager');
	var Entity           = require('Renderer/Entity/Entity');
	var Altitude         = require('Renderer/Map/Altitude');
	var MapControl       = require('Controls/MapControl');
	var Mouse            = require('Controls/MouseEventHandler');
	var KEYS             = require('Controls/KeyEventHandler');
	var UIManager        = require('UI/UIManager');
	var Background       = require('UI/Background');
	var Escape           = require('UI/Components/Escape/Escape');
	var ChatBox          = require('UI/Components/ChatBox/ChatBox');
	var MiniMap          = require('UI/Components/MiniMap/MiniMap');
	var BasicInfo        = require('UI/Components/BasicInfo/BasicInfo');
	var WinStats         = require('UI/Components/WinStats/WinStats');
	var Inventory        = require('UI/Components/Inventory/Inventory');
	var ShortCut         = require('UI/Components/ShortCut/ShortCut');
	var Equipment        = require('UI/Components/Equipment/Equipment');
	var StatusIcons      = require('UI/Components/StatusIcons/StatusIcons');
	var ChatRoomCreate   = require('UI/Components/ChatRoomCreate/ChatRoomCreate');
	var Emoticons        = require('UI/Components/Emoticons/Emoticons');
	var SkillList        = require('UI/Components/SkillList/SkillList');
	var PartyFriends     = require('UI/Components/PartyFriends/PartyFriends');
	var getModule        = require;
	var ReplayEngine     = null;


	/**
	 * @var {string mapname}
	 */
	var _mapName = '';


	/**
	 * @var {boolean} is initialized
	 */
	var _isInitialised = false;


	/**
	 * @var {boolean} skip first packet after MapRender 
	 */
	var _skipedFirst = false;


	/**
	 * @namespace MapEngine
	 */
	var MapEngine = {};


	/**
	 * Connect to Map Server
	 *
	 * @param {number} IP
	 * @param {number} port
	 * @param {string} mapName
	 */
	MapEngine.init = function init( ip, port, mapName )
	{
		_mapName = mapName;

		// Do not hook multiple time
		if (_isInitialised) {
			return;
		}

		_isInitialised = true;

		MapControl.init();

		// Hook packets
		Network.hookPacket( PACKET.ZC.AID,                 onReceiveAccountID );
		Network.hookPacket( PACKET.ZC.ACCEPT_ENTER,        onConnectionAccepted );
		Network.hookPacket( PACKET.ZC.ACCEPT_ENTER2,       onConnectionAccepted );
		Network.hookPacket( PACKET.ZC.NPCACK_MAPMOVE,      onMapChange );
		Network.hookPacket( PACKET.ZC.NPCACK_SERVERMOVE,   function() {} );
		Network.hookPacket( PACKET.ZC.ACCEPT_QUIT,         function() {} );
		Network.hookPacket( PACKET.ZC.REFUSE_QUIT,         onExitFail );
		Network.hookPacket( PACKET.ZC.RESTART_ACK,         function() {} );
		Network.hookPacket( PACKET.ZC.ACK_REQ_DISCONNECT,  function() {} );
		Network.hookPacket( PACKET.ZC.NOTIFY_TIME,         function() {} );

		// Extend controller
		require('../MapEngine/Main').call();
		require('../MapEngine/NPC').call();
		require('../MapEngine/Entity').call();
		require('../MapEngine/Item').call();
		require('../MapEngine/PrivateMessage').call();
		require('../MapEngine/Storage').call();
		require('../MapEngine/Group').init();
		require('../MapEngine/Guild').call();
		require('../MapEngine/Skill').call();
		require('../MapEngine/ChatRoom').call();
		require('../MapEngine/Pet').call();
		require('../MapEngine/Store').call();
		require('../MapEngine/Trade').call();
		require('../MapEngine/Friends').init();

		ReplayEngine = getModule('Engine/ReplayEngine')

		// Prepare UI
		PartyFriends.prepare();
		StatusIcons.prepare();
		BasicInfo.prepare();
		ChatBox.prepare();
	};


	/**
	 * Server update our account id
	 *
	 * @param {object} pkt - PACKET.ZC.AID
	 */
	function onReceiveAccountID( pkt )
	{
		Session.Character.GID = pkt.AID;
	}


	/**
	 * Map accept us to enter the map
	 *
	 * @param {object} pkt - PACKET.ZC.ACCEPT_ENTER
	 */
	function onConnectionAccepted( pkt )
	{
		Session.Entity = new Entity( Session.Character );
		Session.Entity.onWalkEnd = function() {};

		// Reset
		Session.petId         =     0;
		Session.hasParty      = false;
		Session.isPartyLeader = false;

		BasicInfo.update('blvl', Session.Character.level );
		BasicInfo.update('jlvl', Session.Character.joblevel );
		BasicInfo.update('zeny', Session.Character.money );
		BasicInfo.update('name', Session.Character.name );
		BasicInfo.update('job',  Session.Character.job );
		
		// Fix http://forum.robrowser.com/?topic=32177.0
		onMapChange({
			xPos:    pkt.PosDir[0],
			yPos:    pkt.PosDir[1],
			mapName: _mapName
		});
	}


	/**
	 * Changing map, loading new map
	 *
	 * @param {object} pkt - PACKET.ZC.NPCACK_MAPMOVE
	 */
	function onMapChange( pkt )
	{
		jQuery(window).off('keydown.map');

		MapRenderer.onLoad = function(){
			Session.Entity.set({
				PosDir: [ pkt.xPos, pkt.yPos, 0 ],
				GID: Session.Character.GID
			});
			EntityManager.add( Session.Entity );

			// Initialize camera
			Camera.setTarget( Session.Entity );
			Camera.init();

			// Add Game UI
			MiniMap.append();
			MiniMap.setMap( MapRenderer.currentMap );
			ChatBox.append();
			BasicInfo.append();
			Escape.append();
			Inventory.append();
			Equipment.append();
			StatusIcons.append();
			ShortCut.append();
			ChatRoomCreate.append();
			Emoticons.append();
			SkillList.append();
			PartyFriends.append();
		
			// Skip the first two packets before the ACTORINT packet
			if(! _skipedFirst) {
				_skipedFirst = true
				ReplayEngine.playbackNext() 
				ReplayEngine.playbackNext() 
			}

			// Unpause replay engine
			ReplayEngine.playbackResume()
		};

		// Pause replay Engine
		ReplayEngine.playbackPause()

		MapRenderer.setMap( pkt.mapName );
	}

	/**
	 * Server don't want us to disconnect yet
	 *
	 * @param {object} pkt - PACKET.ZC.REFUSE_QUIT
	 */
	function onExitFail( pkt )
	{
		ChatBox.addText( DB.getMessage(502), ChatBox.TYPE.ERROR);
	}

	/**
	 * Export
	 */
	return MapEngine;
});
