/**
 * Handles a message received from the paint room server.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomMessageHandler = Class.extend({
	
	/**
	 * @var PaintRoomClient
	 */
	paintRoomClient: null,
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 * @param PaintRoomClient paintRoomClient
	 */
	init: function(paintRoomClient) {
		this.paintRoomClient = paintRoomClient;
	},
	
	/**
	 * Handles the given message.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message (attributes: data, path, sender)
	 */
	handle: function(message) {
		// To be implemented in the sub class
	}
});