<?php

namespace PaintRoom\Server\Entity;

use Ratchet\ConnectionInterface;
/**
 * Represents an user in the paint room.
 * 
 * @author Benedikt Schaller
 */
class User {
	
	/**
	 * @var ConnectionInterface
	 */
	private $connection;
	
	/**
	 * @var string
	 */
	private $name;
	
	/**
	 * Returns the connection of the user.
	 * 
	 * @author Benedikt Schaller
	 * @return ConnectionInterface
	 */
	public function getConnection() {
		return $this->connection;
	}

	/**
	 * Returns the name of the user.
	 * 
	 * @author Benedikt Schaller
	 * @return string
	 */
	public function getName() {
		return $this->name;
	}

	/**
	 * Sets the connection of the user.
	 * 
	 * @author Benedikt Schaller
	 * @param ConnectionInterface $connection
	 * @return void
	 */
	public function setConnection(ConnectionInterface $connection) {
		$this->connection = $connection;
	}

	/**
	 * Sets the name of the user.
	 * 
	 * @author Benedikt Schaller
	 * @param string $name
	 * @return void
	 */
	public function setName($name) {
		$this->name = $name;
	}

}
