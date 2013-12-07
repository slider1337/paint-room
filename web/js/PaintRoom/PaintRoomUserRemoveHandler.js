/**
 * Handles user remove messages.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomUserRemoveHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Removes the user that is in the given message.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var memberList = this.paintRoomClient.memberList;
		memberList.find('li[username="' + message.data.username + '"]').remove();
	}
});
