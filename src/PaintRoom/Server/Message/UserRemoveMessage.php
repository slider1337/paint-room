<?php

namespace PaintRoom\Server\Message;

/**
 * Message that a specific user was removed from the paint room.
 * 
 * @author Benedikt Schaller
 */
class UserRemoveMessage extends UserContextMessage {
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('user/remove');
	}
}
