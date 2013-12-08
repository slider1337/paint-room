<?php
use PaintRoom\Server\Application;

// Make sure composer dependencies have been installed
require __DIR__ . '/../vendor/autoload.php';

Application::start('localhost', 8080);
