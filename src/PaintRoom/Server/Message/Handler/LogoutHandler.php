<?php

namespace PaintRoom\Server\Message\Handler;

use PaintRoom\Server\Message\Message;
use PaintRoom\Server\MessageServer;
use PaintRoom\Server\Service\UserService;
use PaintRoom\Server\Entity\User;
use PaintRoom\Server\Message\UserRemoveMessage;

/**
 * Handles the logout of an user.
 * 
 * @author Benedikt Schaller
 */
class LogoutHandler implements IMessageHandler {
	
	/**
	 * @var UserService
	 */
	private $userService;
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 * @param UserService $userService
	 */
	public function __construct(UserService $userService) {
		$this->userService = $userService;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \PaintRoom\Server\Message\Handler\IMessageHandler::handleMessage()
	 * @author Benedikt Schaller
	 */
	public function handleMessage(Message $message, MessageServer $messageServer) {
		// Get name of user to remove from message
		$logoutUser = $this->userService->fetchUserByConnection($message->getSender());
		
		if (! $logoutUser instanceof User) {
			// If not logged in user disconnects, we need to do nothing
			return;
		}
		
		// Message for log
		echo "Lotout of user: {$logoutUser->getName()}\n";
				
		// Send a logout message to all remaining users
		$messageUserRemove = new UserRemoveMessage();
		$messageUserRemove->setSender($message->getSender());
		$messageUserRemove->setUsername($logoutUser->getName());
		foreach ($this->userService->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
		
			// Send an user add message to all existing users
			if ($logoutUser != $user) {
				$user->getConnection()->send($messageUserRemove);
			}
		}
		
		// Finally perform logout
		$this->userService->logout($message->getSender());
	}
}
