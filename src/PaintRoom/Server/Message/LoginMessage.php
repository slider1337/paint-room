<?php

namespace PaintRoom\Server\Message;

/**
 * Message that signals a successful login to the client.
 * 
 * @author Benedikt Schaller
 */
class LoginMessage extends UserContextMessage {
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('user/login');
	}
}
