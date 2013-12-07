/**
 * Routes messages from the server to the correct message handler.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomRouter = Class.extend({
	
	/**
	 * List of all message handles. Object will be used as key value map.
	 * 
	 * @access private
	 * @var object
	 */
	handlerList: {},
	
	/**
	 * Constructor.
	 * Creates all messages handlers and the corresponding routes.
	 * 
	 * @author Benedikt Schaller
	 * @param PaintRoomClient paintRoomClient
	 */
	init: function(paintRoomClient) {
		this.handlerList['user/add'] = new PaintRoomUserAddHandler(paintRoomClient);
		this.handlerList['user/remove'] = new PaintRoomUserRemoveHandler(paintRoomClient);
		this.handlerList['user/login'] = new PaintRoomLoginHandler(paintRoomClient);
		this.handlerList['paint'] = new PaintRoomPaintHandler(paintRoomClient);
		this.handlerList['paint/clear'] = new PaintRoomPaintClearHandler(paintRoomClient);
		this.handlerList['text'] = new PaintRoomTextHandler(paintRoomClient);
	},
	
	/**
	 * Routes the given message to the correct message handler if one can found.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	route: function(message) {
		if (this.handlerList[message.path]) {
			var handler = this.handlerList[message.path];
			handler.handle(message);
		}
	},
});