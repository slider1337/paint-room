<?php

namespace PaintRoom\Server\Message;

/**
 * Class to send text messages to a client.
 * 
 * @author Benedikt Schaller
 */
class TextMessage extends Message {
	
	const DATA_KEY_TEXT = 'text';
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->setPath('text');
	}
	
	/**
	 * Sets the message text.
	 * 
	 * @author Benedikt Schaller
	 * @param string $text
	 * @return void
	 */
	public function setText($text) {
		$this->data[self::DATA_KEY_TEXT] = $text;
	}
	
	/**
	 * Returns the message text.
	 * 
	 * @author Benedikt Schaller
	 * @return string
	 */
	public function getText() {
		return $this->data[self::DATA_KEY_TEXT];
	}
}
