/**
 * Strategy to paint like a pencil. If the PaintRoomCanvas uses
 * this strategy, the user can paint wit an pencil on the canvas.
 * 
 * @author Benedikt Schaller
 */
var PaintStrategyPencil = Class.extend({
	
	/**
	 * The last position on the mouse on the canvas while the current
	 * user was painting.
	 * 
	 * @access private
	 * @var PaintPosition
	 */
	lastPaintPosition: new PaintPosition(0, 0),
	
	/**
	 * Called on mouse down.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseDown: function(paintRoomCanvas) {
		// save mouse down position as start of painting
		this.lastPaintPosition = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
	},

	/**
	 * Called on mouse up.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseUp: function(paintRoomCanvas) {
		
	},
	
	/**
	 * Called on mouse move.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintRoomCanvas paintRoomCanvas
	 * @return void
	 */
	mouseMove: function(paintRoomCanvas) {
		// Get the context
		var canvasContext = paintRoomCanvas.canvasContext;
		
		// Create the pencil object to paint
		var positionStart = new PaintPosition(this.lastPaintPosition.x, this.lastPaintPosition.y);
		var positionEnd = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
		var pencil = new PaintPencil(positionStart, positionEnd);
		paintRoomCanvas.addPaintObject(pencil);
		
		// Update paint position
		this.lastPaintPosition = new PaintPosition(paintRoomCanvas.mousePosition.x, paintRoomCanvas.mousePosition.y);
	},
});