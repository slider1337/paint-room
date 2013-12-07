// Define one global variable for the paint room client
var paintRoomClient = null;
$( document ).ready(function() {
	paintRoomClient = new PaintRoomClient('localhost', '80', 'receiver');
});


/**
 * Client to connect to a paint room server.
 * 
 * @author Benedikt Schaller
 */
var PaintRoomClient = Class.extend({
	
	/**
	 * @var HtmlDiv
	 */
	paintRoomContainer: null,

	/**
	 * @var HtmlDiv
	 */
	paintRoomLogin: null,
	
	/**
	 * @var HtmlElement 
	 */
	contextElement: null,
	
	/**
	 * @access private
	 * @var WebSocket 
	 */
	webSocket: null,
	
	/**
	 * Canvas view element to paint on.
	 * 
	 * @access private
	 * @var HtmlCanvas 
	 */
	canvas: null,
	
	/**
	 * View element that holds all paint room controls.
	 * 
	 * @access private
	 * @var HtmlDiv
	 */
	controls: null,
	
	/**
	 * Member list view element.
	 * 
	 * @access private
	 * @var HtmlDiv 
	 */
	memberList: null,
	
	/**
	 * @var PaintRoomRouter
	 */
	messageRouter: null,
	
	/**
	 * Constructor
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param string host The server hostname.
	 * @param int port The port on which the server is running. 
	 */
	init: function(host, port) {
		// Setup login form
		this.paintRoomLogin = $('#paint-room-login');
		this.paintRoomLogin.find('button.submit-login').bind( "click", {that: this}, this.onSubmitLogin);
		this.setContextElement(this.paintRoomLogin.find('input[name="username"]'));
		
		
		// Setup paint room main room controls
		this.paintRoomContainer = $('#paint-room');
		this.controls = $('#paint-controls');
		this.memberList = $('#paint-member-list');
		this.disableClient();

		// Setup canvas
		var canvas = $('#paint-canvas');
		this.canvas = new PaintRoomCanvas(canvas, this);
		this.setPaintStrategy(new PaintStrategyPencil());
		
		// Setup router for messages
		this.messageRouter = new PaintRoomRouter(this);
		
		// Connect to the websocket server
		this.connect(host, port);
	},
	
	/**
	 * Sets the element that a popover will be
	 * added to, if the client receives a text
	 * message from the server.
	 * 
	 * @author Benedikt Schaller
	 * @param HtmlElement element
	 */
	setContextElement: function(element) {
		this.contextElement = $(element);
	},
	
	/**
	 * Returns the element that a popover will be
	 * added to, if the client receives a text
	 * message from the server.
	 * 
	 * @author Benedikt Schaller
	 * @return HtmlElement
	 */
	getContextElement: function(element) {
		return this.contextElement;
	},
	
	/**
	 * Submits the login form.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onSubmitLogin: function(event) {
		// Get the PaintRoomClient object
		var that = event.data.that;
		
		var username = $(this.form).find('input[name="username"]').val();
		var message = {
					data: {
						username: username,
					},
					path: 'user/login'
				};
		that.sendMessage(message);
	},
	
	/**
	 * Create the connection to the server.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param string host The server hostname.
	 * @param int port The port on which the server is running.
	 */
	connect: function(host, port) {
		this.webSocket = new WebSocket('ws://' + host + ':' + port + '/paintroom');
		this.webSocket.onopen = this.onOpenConnection;
		this.webSocket.onmessage = this.onReceiveMessage;
		
		// Needed to receive the PaintRoomClient in the websocket events
		this.webSocket.client = this;
	},
	
	/**
	 * Handler called after the server connection is opened.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onOpenConnection: function(event) {
		// Get the PaintRoomClient object
		var that = this.client;
		
		// Enable the controls
		that.enableClient();
		
		// Log message
		console.log("Connection established!");
	},
	
	/**
	 * Handler called after a message from the server is received.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onReceiveMessage: function(event) {
		// Get the PaintRoomClient object
		var that = this.client;
		
		// Parse the json message
		var message = JSON.parse(event.data);
		
		// Route the message
		that.messageRouter.route(message);
	},
	
	/**
	 * Send an message to the server.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param mixed message The message to deliver.
	 */
	sendMessage: function(message) {
		message = JSON.stringify(message);
		this.webSocket.send(message);
	},
	
	/**
	 * Redraw the painting in the room.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	redraw: function() {
		this.canvas.redraw();
	},
	
	/**
	 * Clears the current picture.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 */
	clear: function() {
		if (! confirm('Do you really want to delete the picture?')) {
			return;
		}
		
		var message = {path: 'paint/clear'};
		this.sendMessage(message);
		
		this.canvas.clear();
	},
	
	/**
	 * Sets the current paint strategy/tool.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param Object paintStrategy The strategy/tool to use for painting.
	 */
	setPaintStrategy: function(paintStrategy) {
		this.canvas.paintStrategy = paintStrategy;
	},
	
	/**
	 * Returns the currently used paint strategy/tool.
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @return Object
	 */
	getPaintStrategy: function() {
		return this.canvas.paintStrategy;
	},

	/**
	 * Disbales the client controls.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 */
	disableClient: function() {
		this.controls.find('input, button').prop('disabled', true);
	},
	
	/**
	 * Enables the client controls.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 */
	enableClient: function() {
		this.controls.find('input, button').prop('disabled', false);
	},
});