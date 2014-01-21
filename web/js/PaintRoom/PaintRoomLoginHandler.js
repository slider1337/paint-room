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
		
		// Reset user list
		var memberList = this.paintRoomClient.memberList;
		memberList.html('');
		
		// Show paint room and hide login form
		this.paintRoomClient.paintRoomContainer.css('display', 'block');
		this.paintRoomClient.paintRoomLogin.css('display', 'none');
		this.paintRoomClient.canvas.resize();
	}
});
