<?php

namespace PaintRoom\Server\Message;

/**
 * Class to send paint objects to a client.
 * 
 * @author Benedikt Schaller
 */
class PaintClearMessage extends Message {
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('paint/clear');
	}
}
