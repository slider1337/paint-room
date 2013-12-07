<?php

namespace PaintRoom\Server\Message;

/**
 * Message that a new user was added to the paint room.
 * 
 * @author Benedikt Schaller
 */
class UserAddMessage extends UserContextMessage {

	const DATA_KEY_IS_ME = 'isMe';
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('user/add');
	}
	
	/**
	 * Sets if the user who is added is the receiver of the message.
	 * 
	 * @author Benedikt Schaller
	 * @param boolean $isMe
	 * @return boolean
	 */
	public function setIsMe($isMe) {
		$this->data[self::DATA_KEY_IS_ME] = $isMe;
	}
	
	/**
	 * Returns if the user who is added is the receiver of the message.
	 * 
	 * @author Benedikt Schaller
	 * @return boolean
	 */
	public function getIsMe() {
		return $this->data[self::DATA_KEY_IS_ME];
	}
}
