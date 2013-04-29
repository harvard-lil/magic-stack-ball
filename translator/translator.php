<?php

function get_composite_doc() {
	// We want to return title, creator, call_num, and subject
	// To do this, we need to stitch the Awesome Box API with the LibraryCloud
	// API.

	$url = "http://librarylab.law.harvard.edu/awesome/api/item/recently-awesome?limit=50";

	$ch = curl_init(); // initialize curl handle
	$user_agent = $_SERVER['HTTP_USER_AGENT']; 
	curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
	curl_setopt($ch, CURLOPT_URL, $url); // set url to post to

	curl_setopt($ch, CURLOPT_TIMEOUT, 5); // times out after 5s
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$response = curl_exec($ch); // if($data === false) echo 'Curl error: ' . curl_error($ch);
	curl_close($ch);

	$jsoned_data = json_decode($response);

	$doc_to_send = array();

	$index = rand(0, count($jsoned_data->docs) -1);
	$doc = $jsoned_data->docs[$index];
	$doc_to_send['title'] = $doc->title;
	$doc_to_send['creator'] = $doc->creator;

	$lc_url = "http://librarycloud.harvard.edu/v1/api/item/?filter=id_inst:" . $doc->hollis_id;

	// We have to get our LibraryCloud ID so that we can serve up
	// a URL to StackLife
	$ch = curl_init();
	$user_agent = $_SERVER['HTTP_USER_AGENT']; 
	curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
	curl_setopt($ch, CURLOPT_URL, $lc_url);

	curl_setopt($ch, CURLOPT_TIMEOUT, 5); // times out after 5s
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$response = curl_exec($ch); // if($data === false) echo 'Curl error: ' . curl_error($ch);
	curl_close($ch);
	$jsoned_lc_data = json_decode($response);
	$doc_to_send['lc_id'] = $jsoned_lc_data->docs[0]->id;
	$doc_to_send['subject'] = $jsoned_lc_data->docs[0]->lcsh[0];
	
//	print_r($doc_to_send);
	
	if (!empty($doc_to_send['title']) && !empty($doc_to_send['creator']) && !empty($doc_to_send['lc_id']) && !empty($doc_to_send['subject'])) {
		return $doc_to_send;
	} else {
		print "not complete. trying again ";
		get_composite_doc();
	}
}

print json_encode(get_composite_doc());

?>