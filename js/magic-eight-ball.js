$(".question").click(function() {


	$('#ball-message').hide();
	
	$.ajax({
	  url: "http://librarylab.law.harvard.edu/awesome/api/item/recently-awesome?limit=30"
	}).done(function() {
		console.log(data);
	});
	
	$.ajax({
	  dataType: "json",
	  url: "http://librarylab.law.harvard.edu/awesome/api/item/recently-awesome?limit=30"
	}).done(function( data ) {console.log(data)});
	
	$("#ball").attr("src", "img/eight-ball.gif");
			
	var position = $('#ball').position();
	
	var ball_message = $('#ball-message').html("<a href='http://stacklife.harvard.edu'>The Idea Factory: Bell Labs and the Great Age of American Innovation<br/><br/>Jon Gertner</a>").css({"position": "absolute", "top": position.top + 150, "left": position.left +255}).delay(1200).fadeIn(2200, "swing");

	$('#image-container').append(ball_message);
});

$(window).resize(function() {
	var position = $('#ball').position();
	$('#ball-message').css({"position": "absolute", "top": position.top + 150, "left": position.left + 255});
});