<?php

namespace PaintRoom\Server\Message\Handler;

use PaintRoom\Server\Message\Message;
use PaintRoom\Server\MessageServer;
use PaintRoom\Server\Service\UserService;
use PaintRoom\Server\Service\PaintService;
use PaintRoom\Server\Message\PaintMessage;
use PaintRoom\Server\Entity\User;

/**
 * Handles paint messages.
 * 
 * @author Benedikt Schaller
 */
class PaintHandler implements IMessageHandler {
	
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
	 * @param PaintService $paintService
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
		$paintData = $message->getData();
		
		// Fetch the user of this message
		$paintUser = $this->userService->fetchUserByConnection($message->getSender());
		if (! $paintUser instanceof User) {
			// Do not paint if no logged in user
			return;
		}

		// Add the painting to the picture
		$this->paintService->addPaintObject($paintData);
		
		// Create the paint message and send them to all other users
		$paintMessage = new PaintMessage();
		$paintMessage->setData($paintData);
		$paintMessage->setSender($paintUser->getConnection());
		$paintMessage->setUsername($paintUser->getName());
		foreach ($this->userService->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
				
			// Send an user add message to all existing users
			if ($user != $paintUser) {
				$user->getConnection()->send($paintMessage);
			}
		}
	}
}
