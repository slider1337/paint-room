<?php

namespace PaintRoom\Server\Message;

/**
 * Base class for messages that are in context to a specific user.
 * 
 * @author Benedikt Schaller
 */
class UserContextMessage extends Message {
	
	const DATA_KEY_USERNAME = 'username';
	
	/**
	 * Sets the username for this message context.
	 * 
	 * @author Benedikt Schaller
	 * @param string $username
	 * @return void
	 */
	public function setUsername($username) {
		$this->data[self::DATA_KEY_USERNAME] = $username;
	}
	
	/**
	 * Returns the username for this message context.
	 * 
	 * @author Benedikt Schaller
	 * @return string
	 */
	public function getUsername() {
		return $this->data[self::DATA_KEY_USERNAME];
	}
}
