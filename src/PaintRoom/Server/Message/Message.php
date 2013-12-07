<?php

namespace PaintRoom\Server\Message;

use Ratchet\ConnectionInterface;

/**
 * Represents a message send to the message server.
 * 
 * @author Benedikt Schaller
 */
class Message implements \JsonSerializable {
	
	/**
	 * @var string
	 */
	protected $path;
	
	/**
	 * @var mixed
	 */
	protected $data;
	
	/**
	 * @var ConnectionInterface
	 */
	protected $sender;
	
	/**
	 * Returns the path of the message.
	 * This will route the message to the correct message handler.
	 * 
	 * @author Benedikt Schaller
	 * @return string
	 */
	public function getPath() {
		return $this->path;
	}

	/**
	 * Returns the message data.
	 * 
	 * @author Benedikt Schaller
	 * @return mixed
	 */
	public function getData() {
		return $this->data;
	}

	/**
	 * Sets the message path.
	 * 
	 * @author Benedikt Schaller
	 * @param string $path
	 * @return void
	 */
	public function setPath($path) {
		$this->path = $path;
	}

	/**
	 * Sets the message data.
	 * 
	 * @author Benedikt Schaller
	 * @param mixed $data
	 * @return void
	 */
	public function setData($data) {
		$this->data = $data;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see JsonSerializable::jsonSerialize()
	 * @author Benedikt Schaller
	 */
	public function jsonSerialize() {
		return get_object_vars($this);
	}
	
	/**
	 * Returns the sender of the message.
	 * 
	 * @author Benedikt Schaller
	 * @return ConnectionInterface
	 */
	public function getSender() {
		return $this->sender;
	}

	/**
	 * Sets the sender of the message.
	 * 
	 * @author Benedikt Schaller
	 * @param ConnectionInterface $sender
	 * @return void
	 */
	public function setSender(ConnectionInterface $sender) {
		$this->sender = $sender;
	}
	
	/**
	 * Deserialize the message from a json value array.
	 * 
	 * @author Benedikt Schaller
	 * @param array $jsonArray
	 * @return void
	 */
	public function jsonDeserialize($jsonArray) {
		foreach ($jsonArray as $key => $value) {
			$this->$key = $value;
		}
	}
	
	/**
	 * String representation of a message.
	 * Converts the message to a json encoded string.
	 * 
	 * @author Benedikt Schaller
	 * @return string
	 */
	public function __toString() {
		return json_encode($this);
	}
}
