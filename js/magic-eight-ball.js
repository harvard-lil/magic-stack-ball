$("#major-suggesion, #book-suggestion").click(function() {

	var node_id = $(this).attr('id');

	$('#ball-message').hide();

	$.ajax({
		dataType: "json",
		url: "translator/translator.php"
	}).done(function( data ) {
		$("#ball").attr("src", "img/eight-ball.gif");

		var position = $('#ball').position();

		var title = data.title;

		if (title.length >= 70) {
			title = title.slice(0, 66) + '...';
		}

		var creator = data.creator;
		if (creator.length >= 19) {
			creator = creator.slice(0, 16) + '...';
		}
		
		var display_text;
		

		
		if ('book-suggestion' === node_id) {
			display_text = title + "<br/><br/>" + creator;
		} else {
			display_text = "I advise you study " + data.subject;
		}

		var ball_message = $('#ball-message').html("<a href='http://stacklife.harvard.edu/item/placeholder/" + data.lc_id + "' target='_blank'>" + display_text + "</a>").css({"position": "absolute", "top": position.top + 155, "left": position.left +255}).delay(1200).fadeIn(2200, "swing");

		$('#image-container').append(ball_message);

	});

});

$(window).resize(function() {
	var position = $('#ball').position();
	$('#ball-message').css({"position": "absolute", "top": position.top + 155, "left": position.left + 255});
});