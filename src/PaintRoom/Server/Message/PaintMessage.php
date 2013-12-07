<?php

namespace PaintRoom\Server\Message;

/**
 * Class to send paint objects to a client.
 * 
 * @author Benedikt Schaller
 */
class PaintMessage extends UserContextMessage {
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('paint');
	}
}
