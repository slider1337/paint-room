<?php

namespace PaintRoom\Server\Message;

/**
 * Is responsable for the routing. Knows which message is handled by which message handler.
 * Currently very simple implementation without wildcards, only static routes.
 * 
 * @author Benedikt Schaller
 */
class MessageRouter {
	
	const ROUTE_OPEN_CONNECTION = 'system/connection/open';
	const ROUTE_CLOSE_CONNECTION = 'system/connection/close';

	/**
	 * @var array
	 */
	private $routes;
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->routes = array();
	}
	
	/**
	 * Returns the message handler of the message or null if none can be found.
	 * 
	 * @author Benedikt Schaller
	 * @param Message $message
	 * @return IMessageHandler|null
	 */
	public function route(Message $message) {
		if (array_key_exists($message->getPath(), $this->routes)) {
			return $this->routes[$message->getPath()];
		}
		return null;
	}
	
	/**
	 * Adds the given handler for the given route.
	 * 
	 * @author Benedikt Schaller
	 * @param string $path
	 * @param IMessageHandler $handler
	 * @return void
	 */
	public function addRoute($path, IMessageHandler $handler) {
		$this->routes[$path] = $handler;
	}
}
