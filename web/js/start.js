var client = null;
$( document ).ready(function() {
	client = new PaintRoomClient('localhost', '80', 'receiver')
});
