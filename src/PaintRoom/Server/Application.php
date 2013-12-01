<?php
namespace PaintRoom\Server;

use Ratchet\App;
use PaintRoom\Server\Message\MessageServer;

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
		$server = new App($host, $port);
		$server->route('/paintroom', new MessageServer(), array('*'));
		$server->run();
	}
}
