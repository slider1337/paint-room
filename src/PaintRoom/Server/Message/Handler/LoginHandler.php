<?php

namespace PaintRoom\Server\Message\Handler;

use PaintRoom\Server\Message\Message;
use PaintRoom\Server\MessageServer;
use PaintRoom\Server\Service\UserService;
use PaintRoom\Server\Entity\User;
use PaintRoom\Server\Message\TextMessage;
use PaintRoom\Server\Message\UserAddMessage;
use PaintRoom\Server\Message\LoginMessage;
use PaintRoom\Server\Service\PaintService;
use PaintRoom\Server\Message\PaintMessage;

/**
 * Handles the login of an user.
 * 
 * @author Benedikt Schaller
 */
class LoginHandler implements IMessageHandler {
	
	/**
	 * @var UserService
	 */
	private $userService;

	/**
	 * @var PaintService
	 */
	private $paintService;
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 * @param UserService $userService
	 */
	public function __construct(UserService $userService, PaintService $paintService) {
		$this->userService = $userService;
		$this->paintService = $paintService;
	}
	
	/**
	 * (non-PHPdoc)
	 * @see \PaintRoom\Server\Message\Handler\IMessageHandler::handleMessage()
	 * @author Benedikt Schaller
	 */
	public function handleMessage(Message $message, MessageServer $messageServer) {
		$username = $message->getData()['username'];
		
		if (! $this->userService->isUsernameFree($username)) {
			// If no valid username, send message to client
			$usernameNotFreeMessage = new TextMessage();
			$usernameNotFreeMessage->setText('This username is not valid!');
			$message->getSender()->send($usernameNotFreeMessage);
			return;
		} else {
			// Send the user the message, that the login was successful
			$loginMessage = new LoginMessage();
			$loginMessage->setSender($message->getSender());
			$loginMessage->setUsername($username);
			$message->getSender()->send($loginMessage);
			
			// Send the new user the complete picture
			$picture = $this->paintService->getPaintObjects();
			$paintMessage = new PaintMessage();
			$paintMessage->setSender($message->getSender());
			$paintMessage->setUsername($username);
			foreach ($picture as $paintObject) {
				$paintMessage->setData($paintObject);
				$message->getSender()->send($paintMessage);
			}
		}
		
		// Perform login an notify clients
		$newUser = $this->userService->login($username, $message->getSender());
		// Message for all users that a new user logged in
		$messageUserNew = new UserAddMessage();
		$messageUserNew->setSender($message->getSender());
		$messageUserNew->setUsername($newUser->getName());
		// Prototype message for the new users to get all users
		$messageUserAdd = new UserAddMessage();
		foreach ($this->userService->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
				
			// Send an user add message to all existing users
			if ($newUser != $user) {
				$user->getConnection()->send($messageUserNew);
			}
				
			// Send an user add message for each existing user to the new user
			$messageUserAdd->setUsername($user->getName());
			// Add a flag if it if the current user so that the client knows it
			$messageUserAdd->setIsMe($newUser == $user);
			$newUser->getConnection()->send($messageUserAdd);
		}
	}
}
