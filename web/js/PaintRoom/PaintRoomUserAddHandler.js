/**
 * Handles user add messages.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomUserAddHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Adds the message user to the member list.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var memberList = this.paintRoomClient.memberList;
		if (message.data.isMe) {
			memberList.append('<li class="list-group-item" username="' + message.data.username + '"><b>' + message.data.username + '<b><span class="badge">Me</span></li>');
		} else {
			memberList.append('<li class="list-group-item" username="' + message.data.username + '">' + message.data.username + '</li>');
		}
	}
});
