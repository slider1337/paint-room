/**
 * Handles the login.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomLoginHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Shows the paint room main view.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var username = message.username;
		
		var contextElement = this.paintRoomClient.paintRoomContainer.css('display', 'block');
		var contextElement = this.paintRoomClient.paintRoomLogin.css('display', 'none');
		this.paintRoomClient.canvas.resize();
	}
});
