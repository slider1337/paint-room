<?php
namespace PaintRoom\Server;

use Ratchet\App;
use PaintRoom\Server\Message\MessageServer;
use PaintRoom\Server\Message\MessageRouter;

/**
 * Application class for the paint room server application.
 * Creates a rachet websocket server and host the paint-room apllication.
 * 
 * @author Benedikt Schaller
 */
class Application {
	
	/**
	 * Starts the paint-room server on the given host and port.
	 * 
	 * @param string $host
	 * @param int $port
	 * @return void
	 */
	public static function start($host, $port) {
		// Create the router with all the routes
		$router = new MessageRouter();
		$router->addRoute(MessageRouter::ROUTE_OPEN_CONNECTION, $handler);
		$router->addRoute(MessageRouter::ROUTE_CLOSE_CONNECTION, $handler);
		
		
		// Create the message server as handler for all paint room messages
		$messageServer = new MessageServer($router);
		
		// Create the websocket server with the path for the paint room
		$server = new App($host, $port);
		$server->route('/paintroom', $messageServer, array('*'));
		$server->run();
	}
}
