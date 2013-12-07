<?php

namespace PaintRoom\Server\Service;

/**
 * Implements all buisiness logic about painting in the paint room.
 * 
 * @author Benedikt Schaller
 */
class PaintService {
	
	/**
	 * @var \SplStack
	 */
	private $paintList;
	
	/**
	 * Constructor.
	 * 
	 * @author Benedikt Schaller
	 */
	public function __construct() {
		$this->paintList = new \SplStack();
	}
	
	/**
	 * Adds a paint object to the picture.
	 * 
	 * @author Benedikt Schaller
	 * @param array $paintData
	 * @return void
	 */
	public function addPaintObject(array $paintData) {
		$this->paintList->push($paintData);
	}
	
	/**
	 * Returns the list of paint objects.
	 * 
	 * @author Benedikt Schaller
	 * @return \SplStack
	 */
	public function getPaintObjects() {
		return $this->paintList;
	}
	
	/**
	 * Clears the picture.
	 *
	 * @author Benedikt Schaller
	 * @return void
	 */
	public function clearPicture() {
		$this->paintList = new \SplStack();
	}
}
