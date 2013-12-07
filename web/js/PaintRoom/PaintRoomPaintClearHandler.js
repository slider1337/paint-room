/**
 * Handles clear messages that delete the current picture.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomPaintClearHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Clears the current picture.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var canvas = this.paintRoomClient.canvas;
		canvas.clear();
	},
});
