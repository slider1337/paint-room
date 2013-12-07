<?php
namespace PaintRoom\Server;

use Ratchet\App;
use PaintRoom\Server\MessageServer;
use PaintRoom\Server\MessageRouter;
use PaintRoom\Server\Service\UserService;
use PaintRoom\Server\Message\Handler\LoginHandler;
use PaintRoom\Server\Message\Handler\LogoutHandler;
use PaintRoom\Server\Message\Handler\PaintHandler;
use PaintRoom\Server\Service\PaintService;
use PaintRoom\Server\Message\Handler\PaintClearHandler;

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
		try {
			// Create all needed services
			$userService = new UserService();
			$paintService = new PaintService();
			
			// Create the router with all the routes
			$router = new MessageRouter();
			$router->addRoute('user/login', new LoginHandler($userService, $paintService));
			$router->addRoute(MessageRouter::ROUTE_CLOSE_CONNECTION, new LogoutHandler($userService));
			$router->addRoute('paint', new PaintHandler($userService, $paintService));
			$router->addRoute('paint/clear', new PaintClearHandler($userService, $paintService));
			
			// Create the message server as handler for all paint room messages
			$messageServer = new MessageServer($router);
			
			// Create the websocket server with the path for the paint room
			$server = new App($host, $port);
			$server->route('/paintroom', $messageServer, array('*'));
			$server->run();
		} catch (\Exception $ex) {
			var_dump($ex);
		}
	}
}
