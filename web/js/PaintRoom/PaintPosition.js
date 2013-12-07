/**
 * Represents an position of the mouse on the canvas.
 * 
 * @author Benedikt Schaller
 */
var PaintPosition = Class.extend({
	
	/**
	 * @access public
	 * @var int
	 */
	x: 0,
	
	/**
	 * @access public
	 * @var int
	 */
	y: 0,
	
	/**
	 * Constructor.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param int x The x position.
	 * @param int y The y position.
	 */
	init: function(x, y){
		this.x = x;
		this.y = y;
	},
});