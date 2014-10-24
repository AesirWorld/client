/**
 * Engine/ReplayEngine/Hooks.js
 *
 * Override default hook's with proper behavior for a replay context.
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
	var Network       = require('Network/NetworkManager');
	var PACKET        = require('Network/PacketStructure');
	var NpcBox        = require('UI/Components/NpcBox/NpcBox');


	/**
	 * Close NPC Dialog
	 * Wait 3 seconds.
	 */
	function CloseNPC()
	{
		setTimeout(function() {
			NpcBox.remove();

			var cutin = document.getElementById('cutin');
			if (cutin && cutin.parentNode) {
				document.body.removeChild(cutin);
			}
		}, 3000)
	}


	/**
	 * Void function
	 */
	function Void()
	{
		return
	}


	/**
	 * Initialize
	 */
	return function HooksOverride()
	{
		// Engine/MapEngine/NPC.js
		Network.hookPacket( PACKET.ZC.CLOSE_DIALOG,    CloseNPC );
		Network.hookPacket( PACKET.ZC.OPEN_EDITDLG,    Void );
		Network.hookPacket( PACKET.ZC.OPEN_EDITDLGSTR, Void );
		Network.hookPacket( PACKET.ZC.MENU_LIST,       Void );
		Network.hookPacket( PACKET.ZC.SELECT_DEALTYPE, Void );
		// Engine/MapEngine/Pet.js
		Network.hookPacket( PACKET.ZC.START_CAPTURE,   Void );
		Network.hookPacket( PACKET.ZC.PETEGG_LIST,     Void );
		Network.hookPacket( PACKET.ZC.PROPERTY_PET,    Void );
		// Engine/MapEngine.js
		Network.hookPacket( PACKET.ZC.NPCACK_SERVERMOVE, Void );
		Network.hookPacket( PACKET.ZC.ACCEPT_QUIT, Void );
		Network.hookPacket( PACKET.ZC.ACK_REQ_DISCONNECT, Void );
		Network.hookPacket( PACKET.ZC.RESTART_ACK, Void );
	};
});
