<?php

namespace PaintRoom\Server\Message\Handler;

use PaintRoom\Server\Message\Message;
use PaintRoom\Server\MessageServer;
use PaintRoom\Server\Service\UserService;
use PaintRoom\Server\Service\PaintService;
use PaintRoom\Server\Entity\User;
use PaintRoom\Server\Message\PaintClearMessage;

/**
 * Hanldes the clear message and deletes the picture.
 * 
 * @author Benedikt Schaller
 */
class PaintClearHandler implements IMessageHandler {
	
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
		// Create the clear message and send them to all other users
		$clearMessage = new PaintClearMessage();
		$clearMessage->setSender($message->getSender());
		foreach ($this->userService->getUsers() as $user) {
			if (! $user instanceof User) {
				continue;
			}
				
			// Send an user add message to all existing users
			if ($user->getConnection() != $message->getSender()) {
				$user->getConnection()->send($clearMessage);
			}
		}
		
		// Delete the picture
		$this->paintService->clearPicture();
	}
}
