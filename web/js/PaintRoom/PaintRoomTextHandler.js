/**
 * Handles text messages.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomTextHandler = PaintRoomMessageHandler.extend({
	
	/**
	 * Shows a text in a popup.
	 * 
	 * @author Benedikt Schaller
	 * @param Object message
	 */
	handle: function(message) {
		var text = message.data.text;
		
		var contextElement = this.paintRoomClient.getContextElement();
		contextElement.popover({placement: 'auto', content: text});
		contextElement.popover('show');

	}
});
