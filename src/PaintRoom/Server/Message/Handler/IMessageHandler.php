<?php

namespace PaintRoom\Server\Message\Handler;

use PaintRoom\Server\Message\Message;
use PaintRoom\Server\MessageServer;
/**
 * Interface for each class that can handle received messages from the MessageServer.
 * 
 * @author Benedikt Schaller
 */
interface IMessageHandler {
	
	/**
	 * Handles the received message.
	 * 
	 * @author Benedikt Schaller
	 * @param Message $message
	 * @param MessageServer $messageServer
	 * @return void
	 */
	public function handleMessage(Message $message, MessageServer $messageServer);
}
