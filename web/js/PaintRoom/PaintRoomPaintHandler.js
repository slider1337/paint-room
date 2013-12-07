/**
 * Handles paint messages.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomPaintHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Paints the object given in the message.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var canvas = this.paintRoomClient.canvas;
		var paintObjectType = message.data.type;
		var paintObject = null;
		if (paintObjectType == 'pencil') {
			paintObject = this.createPencil(message.data);
		}
		
		if (paintObject != null) {
			canvas.addPaintObject(paintObject, true);
			canvas.paint();
		}
	},
	
	/**
	 * Create a PaintPencil object from the message data.
	 * 
	 * @author Benedikt Schaller
	 * @param Object data
	 * @return PaintPencil
	 */
	createPencil: function(data) {
		var positionStart = new PaintPosition(data.positionStart.x, data.positionStart.y);
		var positionEnd = new PaintPosition(data.positionEnd.x, data.positionEnd.y);
		var pencil = new PaintPencil(positionStart, positionEnd);
		return pencil;
	},
});
