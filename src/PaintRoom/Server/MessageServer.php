<?php

namespace PaintRoom\Server;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PaintRoom\Server\Message\Message;
use PaintRoom\Server\Message\Handler\IMessageHandler;

/**
 * Handles the websocket communication with all clients.
 * 
 * @author Benedikt Schaller
 */
class MessageServer implements MessageComponentInterface {
	
	/**
	 * @var \SplObjectStorage
	 */
    protected $clients;
    
    /**
     * @var MessageRouter
     */
    protected $router;

    /**
     * Constructor.
     * 
     * @author Benedikt Schaller
     */
    public function __construct(MessageRouter $router) {
        $this->clients = new \SplObjectStorage;
        $this->router = $router;
    }

    /**
     * Returns the client list.
     * 
     * @author Benedikt Schaller
	 * @return \SplObjectStorage The list of clients.
	 */
	public function getClients() {
		return $this->clients;
	}

	/**
	 * Add a client to the connection pool.
	 * 
	 * @author Benedikt Schaller
	 * @param SplObjectStorage $clients
	 * @return void
	 */
	protected function addClient(ConnectionInterface $client) {
		$this->clients->attach($client);
	}
	
	/**
	 * Removes a client from the connection pool.
	 * 
	 * @author Benedikt Schaller
	 * @param ConnectionInterface $client
	 * @return void
	 */
	protected function removeClient(ConnectionInterface $client) {
		$this->clients->detach($client);
	}

	/**
	 * (non-PHPdoc)
	 * @see \Ratchet\ComponentInterface::onOpen()
	 * @author Benedikt Schaller
	 */
	public function onOpen(ConnectionInterface $conn) {
        // Store the new connection to send messages to later
        $this->addClient($conn);
        
        // Create open connection message and route it
        $message = new Message();
        $message->setPath(MessageRouter::ROUTE_OPEN_CONNECTION);
        $message->setSender($conn);
        $this->handleMessage($message);

        echo "New connection! ({$conn->resourceId})\n";
    }

    /**
     * (non-PHPdoc)
     * @see \Ratchet\MessageInterface::onMessage()
     * @author Benedikt Schaller
     */
    public function onMessage(ConnectionInterface $from, $msg) {
    	$clients = $this->getClients();
    	
        $numRecv = count($clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
            , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        $messageArray = json_decode($msg, true);
        $message = new Message();
        $message->jsonDeserialize($messageArray);
        $message->setSender($from);
        $this->handleMessage($message);
    }

    /**
     * (non-PHPdoc)
     * @see \Ratchet\ComponentInterface::onClose()
     * @author Benedikt Schaller
     */
    public function onClose(ConnectionInterface $conn) {
    	// Create close connection message and route it
    	$message = new Message();
    	$message->setPath(MessageRouter::ROUTE_CLOSE_CONNECTION);
    	$message->setSender($conn);
    	$this->handleMessage($message);
    	
        // The connection is closed, remove it, as we can no longer send it messages
        $this->removeClient($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    /**
     * (non-PHPdoc)
     * @see \Ratchet\ComponentInterface::onError()
     * @author Benedikt Schaller
     */
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        var_dump($e);

        // Close connection on error
        $this->onClose($conn);
    }
    
    /**
     * Handles a message received by this server.
     * 
     * @author Benedikt Schaller
     * @param Message $message
     * @return void
     */
    private function handleMessage(Message $message) {
    	try {
    		$handler = $this->router->route($message);
    		if ($handler instanceof IMessageHandler) {
    			$handler->handleMessage($message, $this);
    		}
    	} catch (\Exception $ex) {
    		var_dump($ex);
    	}
    }
}