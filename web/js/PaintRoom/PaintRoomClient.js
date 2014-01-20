// Define one global variable for the paint room client
var paintRoomClient = null;
$( document ).ready(function() {
	paintRoomClient = new PaintRoomClient('localhost', '8080');
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
	 * @var string
	 */
	host: null,
	
	/**
	 * @var string
	 */
	port: null,
	
	/**
	 * Constructor
	 * 
	 * @access public
	 * @author Benedikt Schaller
	 * @param string host The server hostname.
	 * @param int port The port on which the server is running. 
	 */
	init: function(host, port) {
		this.host = host;
		this.port = port;
		
		// Setup login form
		this.paintRoomLogin = $('#paint-room-login');
		this.paintRoomLogin.find('button.submit-login').bind( "click", {that: this}, this.onSubmitLogin);
		this.setContextElement(this.paintRoomLogin.find('input[name="username"]'));
		this.paintRoomLogin.find('input[name="username"]').bind( "keypress", {that: this}, this.onLoginKeyPress);
		
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
		this.connect();
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
		
		if (that.webSocket.readyState != 1) {
			// If connection was closed, try to reconnect and then login
			that.connect(that.login);
		} else {
			// Otherwise try login directly
			that.login();
		}
	},
	
	/**
	 * Trys a login.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 */
	login: function(that) {
		// If called as event handler, the client will be passed as parameter
		// otherwise we are called in the right context
		if (! that) {
			that = this;
		}
		var username = $(that.paintRoomLogin).find('input[name="username"]').val();
		var message = {
					data: {
						username: username,
					},
					path: 'user/login'
				};
		that.sendMessage(message);
	},
	
	/**
	 * Submits the login form on enter key press.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onLoginKeyPress: function(event) {
		if (event.which == 13) {
			$('button.submit-login').click();
			event.preventDefault();
		}
	},
	
	/**
	 * Create the connection to the server.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Function onConnectCallback The callback function to call after the connection was established.
	 */
	connect: function(onConnectCallback) {
		var that = this;
		this.webSocket = new WebSocket('ws://' + this.host + ':' + this.port + '/paintroom');
		this.webSocket.onopen = function(event) {that.onOpenConnection(event);if (onConnectCallback) {onConnectCallback(that);}};
		this.webSocket.onmessage = function(event) {that.onReceiveMessage(event);};
		this.webSocket.onclose = function(event) {that.onCloseConnection(event);};
	},
	
	/**
	 * Handler called after the server connection is opened.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onOpenConnection: function(event) {
		// Enable the controls
		this.enableClient();
		
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
		// Parse the json message
		var message = JSON.parse(event.data);
		
		// Route the message
		this.messageRouter.route(message);
	},
	
	/**
	 * Handler called when websocket connection is closed.
	 * 
	 * @access private
	 * @author Benedikt Schaller
	 * @param Event event The triggered event.
	 */
	onCloseConnection: function(event) {
		// Hide paint room and go back to login screen
		this.paintRoomContainer.css('display', 'none');
		this.paintRoomLogin.css('display', 'block');
		
		// Show error message
		text = 'Connection was closed: ';
		if (event.reason.length > 0) {
			text += event.reason;
		} else {
			text += 'No reason given';
		}
		text += ' (Code: ' + event.code + ').';
		var contextElement = this.getContextElement();
		contextElement.popover({placement: 'auto', content: text});
		contextElement.popover('show');
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