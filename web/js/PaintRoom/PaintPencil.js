/**
 * Represents a pencil moving over the canvas through various points.
 * 
 * @author Benedikt Schaller
 */
var PaintPencil = Class.extend({
	
	/**
	 * @access public
	 * @var PaintPosition
	 */
	positionStart: null,
	
	/**
	 * @access public
	 * @var PaintPosition
	 */
	positionEnd: null,
	
	/**
	 * Will be transmitted to the server so that we know what to paint.
	 * 
	 * @var string
	 */
	type: null,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param PaintPosition positionStart The beginning point of the pencil.
	 * @param PaintPosition positionEnd The end of the pencil.
	 */
	init: function(positionStart, positionEnd){
		this.positionStart = positionStart;
		this.positionEnd = positionEnd;
		this.type = 'pencil';
	},
	
	/**
	 * Paints the pencil line on the given canvas.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param HtmlCanvasContext canvasContext The context of the canvas to paint on.
	 */
	paint: function(canvasContext) {
		// Set properties for the pencil painting
		canvasContext.lineWidth = 5;
		canvasContext.lineJoin = 'round';
		canvasContext.lineCap = 'round';
		canvasContext.strokeStyle = 'blue';
		
		// Paint a line
		canvasContext.beginPath();
		canvasContext.moveTo(this.positionStart.x, this.positionStart.y);
		canvasContext.lineTo(this.positionEnd.x, this.positionEnd.y);
		canvasContext.closePath();
		canvasContext.stroke();
	},
});