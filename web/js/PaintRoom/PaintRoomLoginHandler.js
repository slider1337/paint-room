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
		// Currently not needed
		//var username = message.username;
		
		this.paintRoomClient.paintRoomContainer.css('display', 'block');
		this.paintRoomClient.paintRoomLogin.css('display', 'none');
		this.paintRoomClient.canvas.resize();
	}
});
