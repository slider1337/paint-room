<?php

namespace PaintRoom\Server\Service;

use Ratchet\ConnectionInterface;
use PaintRoom\Server\Entity\User;
/**
 * Implements all buisiness logic about an user in the paint room.
 * 
 * @author Benedikt Schaller
 */
class UserService {
	
	/**
	 * @var \SplObjectStorage
	 */
	private $userList;
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->userList = new \SplObjectStorage();
	}
	
	/**
	 * Adds the user to the list.
	 * 
	 * @author Benedikt Schaller
	 * @param User $user
	 * @return void
	 */
	private function addUser(User $user) {
		$this->userList->attach($user);
	}
	
	/**
	 * Returns the list of users.
	 * 
	 * @author Benedikt Schaller
	 * @return \SplObjectStorage
	 */
	public function getUsers() {
		return $this->userList;
	}
	
	/**
	 * Removes an user from the list.
	 * 
	 * @author Benedikt Schaller
	 * @param User $user
	 * @return void
	 */
	public function removeUser(User $user) {
		$this->userList->detach($user);
	}
	
	/**
	 * If the username is not already taken, a new user in the paint room
	 * will be created an returned. Otherwise null will be returned.
	 *
	 * @author Benedikt Schaller
	 * @param string $username
	 * @param ConnectionInterface $connection
	 * @return User|null
	 */
	public function login($username, ConnectionInterface $connection) {
		// Ensure free username
		if (! $this->isUsernameFree($username)) {
			return null;
		}
		
		// Create a new user and add it to the list
		$user = new User();
		$user->setConnection($connection);
		$user->setName($username);
		$this->addUser($user);
		
		// Return the user
		return $user;
	}
	
	/**
	 * Checks if a user is already in the paint room with this name.
	 *
	 * @author Benedikt Schaller
	 * @param string $username
	 * @return boolean
	 */
	public function isUsernameFree($username) {
		foreach ($this->userList as $user) {
			if (! $user instanceof User) {
				continue;
			}
			
			if ($username == $user->getName()) {
				return false;
			}
		}
		echo 'Login: no user found';
		// Check for valid characters in username
		if (! preg_match('/^[a-zA-Z0-9]+$/', $username)) {
			echo 'Login: no valid - ' . $username;
			return false;
		}
		
		return true;
	}
	
	/**
	 * Logs the user with the given connection out.
	 * 
	 * @author Benedikt Schaller
	 * @param ConnectionInterface $connection
	 * @return void
	 */
	public function logout(ConnectionInterface $connection) {
		foreach ($this->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
			
			if ($user->getConnection() == $connection) {
				// If correct connection remove the user from the list
				$this->removeUser($user);
			}
		}
	}
	
	/**
	 * Returns the user of the given connection.
	 * 
	 * @author Benedikt Schaller
	 * @param ConnectionInterface $connection
	 * @return User|null
	 */
	public function fetchUserByConnection(ConnectionInterface $connection) {
		foreach ($this->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
			
			if ($user->getConnection() == $connection) {
				return $user;
			}
		}
		return null;
	}
}
