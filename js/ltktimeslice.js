/*------------------------------------------
			variables for customization
-------------------------------------------*/

/*	searchterm: what's the #hashtag used for selection. "*" is "all elements" */
var searchterm="*";


/*	futureRangeStart: pull future events starting from this date. default is today. 
	futureRangeEnd: pull future events up until this date. default is null */
var futureRangeStart = Date.today();
var futureRangeEnd = null;


/*	pastRangeStart: pull past events starting from this date. default is null. 
	pastRangeEnd: pull past events up until this date. default is today */
var pastRangeStart = null;
var pastRangeEnd = Date.today();


/* dateoption: defines whether dates should be displayed monthly (1), weekly (2), daily(3) 
or not at all (0). default value is 0. */
var dateoption = 1;



/*	event display controls */
var showInfo = false;
var showTime = false;
var showDate = true;
var showHash = false;
var oldVis = true;



/*------------------------------------------
			global variables
-------------------------------------------*/

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var jsonobj = null;
var oldjson = null;
var myVideos;
var hashtagarray = [];

var tripped = false;
var videoId;
var endIndex;

var currdate = Date.today();
var prevdataID, prevdate = currdate;
var idpaths = new Object();
var idtimes = new Object();
var iddescr = new Object();
var isDaily, isWeekly, isMonthly, noDate = false;
var dateFormat;

var futurerange = new Array(futureRangeStart, futureRangeEnd);
var pastrange = new Array(pastRangeStart, pastRangeEnd);


var librarynames = new Array("widener", "wid", "langdell", "baker", "business", "sciencecenter", "divinity", "loeb", "lamont", "gutman", "pusey", "science", "gutman", "wolbach", "music", "zoology", "finearts", "div", "divinity", "mapcollection", "maps", "robbins", "philosophy", "phil", "hks", "kennedyschool", "arboretum", "schlesinger", "radcliffe", "zoo", "medical", "med", "ernstmayr", "countway", "law", "astro", "arnold", "littauer", "gov", "government", "fineart");
var libmap = { "widener": ["wid", "widener"], "langdell": ["langdell", "law"], "baker": ["baker", "business"], "sciencecenter": ["science", "cabot"], "divinity": ["div", "divinity"], "music": ["loeb", "music"], "lamont": ["lamont"], "gutman": ["ed", "edu", "education", "gutman"], "wolbach": ["wolbach", "astro", "astrophysics"], "fineart": ["finearts", "littauer", "fineart"], "pusey": ["maps", "pusey", "mapcollection"], "zoology": ["zoo", "ernstmayr", "zoology", "ernestmayr"], "robbins": ["robbins", "phil", "philosophy"], "kennedy school": ["kennedyschool", "gov", "government", "hks"], "countway": ["med", "medical", "countway"], "schlesinger": ["schlesinger", "radcliffe"], "arboretum": ["arnold", "arboretum", "arnoldarboretumlibrary"]};
var libtags = new Object();
var cache = [];

/*------------------------------------------
			function stuff
-------------------------------------------*/

//GET search term from URL
var parts = window.location.search.substr(1).split("&");
var $_GET = {};
for (var i = 0; i < parts.length; i++) {
    var temp = parts[i].split("=");
    $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
}


var arg = $_GET['kw'];
if(arg != null) searchterm = arg;


function prehousekeeping() {
	switch(dateoption) {
	case 0:
		noDate = true;
		break;
	case 1:
		isMonthly = true;
		dateformat = "MMMM";
		dateIdFormat = "MMyyyy";
		break;
	case 3:
		isDaily = true;
		dateformat = "dddd MMM dd";
		dateIdFormat = "MMddyyyy";
		break;
	}
	
	
}


function loadstuff() {
	$('#board').isotope({
		itemSelector: '.item',
		//resizable: false,
  		layoutMode: 'fitRows'
      });
};

$(document).ready(function () {
	prehousekeeping();
	console.log(jsonobj);

	if(jsonobj != null) addElems(jsonobj, true);

	//preLoadImages(cache);


	//posthousekeeping();
      
    $("#board").fitVids();


});




function preLoadImages(imgArray) {
	var cache = [];
    var args_len = imgArray.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = imgArray[i];
      cache.push(cacheImage);
    }
}





/* 	resizeImage(elem): when an image is clicked, resizes the parent div. hides the time
	div on large view, shows it on small view. */
function resizeImage(elem) {
	$par = $(elem).parents().eq(2);
	$par.toggleClass('large');
	var url = $(elem).attr('src');
	var id = $par.attr('id');
	
	if(url.indexOf("_thumb") != -1) {
		$(elem).attr('src', url.replace(id+"_thumb", id));
	}

}



/* 	addElems(jsonobj, isNew): goes through a json object of events and adds them to the
	#container. */
function addElems(jsonobj, isNew) {

	var count = 1;
	for(var i = 0; i < 10; i++) {
		insertFirstItems(jsonobj[i]);
	}	
	
	loadstuff();
	$("#board").isotope('reLayout');
	$("#board").isotope({ filter: '.first' });
	
	for(var i = 10; i <jsonobj.length; i++) {
		insertRestOfTags(jsonobj[i]);
	}
	
	wrapper(jsonobj);

}

function wrapper(json) {
	for(var i = 10; i <json.length; i++) {
	
		insertRestOfItems(json[i]);
	}
	
}

function insertFirstItems(item) {
	var source = $("#field-template").html();
	if(item.imgbool == 2) source = $("#vidfield-template").html();
	item.baseurl = item.imgpath.substr(0, item.imgpath.length - 4);
	item.type = item.imgpath.substr(-4);
	console.log(item);
	var template = Handlebars.compile(source);
	$("#board").append("<div id='"+item.emailid+"' class='item'></div>");
	var currDiv = $('#' + item.emailid);
	$(currDiv).html(template(item));
	addHashTags(item.emailid, item.hashtags);
		//addDate(item);
	if(item.portrait == 1) $(currDiv).addClass("tall");
	else $(currDiv).addClass("wide");
	
	$(currDiv).addClass("first");
	

}


function insertRestOfItems(item) {
	var source = $("#field-template").html();
	if(item.imgbool == 2) source = $("#vidfield-template").html();
	item.baseurl = item.imgpath.substr(0, item.imgpath.length - 4);
	item.type = item.imgpath.substr(-4);
	
	var template = Handlebars.compile(source);
	var $newItem = $("#"+item.emailid);
	$newItem.html(template(item));
	
//	cache.push(item.baseurl+item.type);

}

function insertRestOfTags(item) {

	var newItem = $("<div id='"+item.emailid+"' class='item'></div>");
	$("#board").isotope('insert', newItem);
	addHashTags(item.emailid, item.hashtags);
	if(item.portrait == 1) $(newItem).addClass("tall");
	else $(newItem).addClass("wide");
	

}

function addDate(item) {
	var currdate = Date.parse(item.eventdate);
	var currtime = Date.parse(item.eventtime);
	var thisdate = currdate.toString('MMM d');
	var thistime = currtime.toString('h:mm tt');
	$("#"+item.emailid).find(".datestring").html(thisdate);
	$("#"+item.emailid).find(".timestring").html(thistime);
}


function addHashTags(id, tagarray) {


	
	var libs = [];
	var temptags = [];
	$.each(tagarray, function(i, val) {
		val = $.trim(val);
		val=val.toLowerCase();
		if(val != "" && val != null) {
			var extra="#";
			if(i>0) extra = " #";


			$.each(libmap, function(key, elem) {
				if(elem.indexOf(val) != -1) val = key;
			});
			
			if(librarynames.indexOf(val) != -1) libs.push(val);
			else {
				temptags.push(val);
				if(hashtagarray.indexOf(val) == -1) hashtagarray.push(val);
			}
			
			$("#"+id).find(".hash").append(extra+'<a href="#" class="hashtag '+val+'" data-filter=".'+val+'">'+val+'</a>');
			$("#"+id).addClass(val);
		}
	});
	
	
	$.each(libs, function(i, name) {
		var temparray = libtags[name];
		if(temparray) $.merge(temptags, temparray);

		libtags[name] = temptags;
	});
	
}

function removeDupes(array) {
	var clean = [];
	$.each(array, function(i, val) {
		if(clean.indexOf(val) == -1) clean.push(val);
	});
	
	clean.sort();
	
	return clean;

}

function addTags() {
	console.log(libtags);
	for (var key in libtags) {
		if (libtags.hasOwnProperty(key)) {
			libtags[key] = removeDupes(libtags[key]);
			console.log(key);
			var source = $("#facet-template").html();
			var template = Handlebars.compile(source);
			$("#tagsbylib").append("<div id='lib-"+key+"'></div>");
			var currDiv = $('#lib-' + key);
			var obj = new Object();
			obj.name = key;
			obj.tags = libtags[key];
			$(currDiv).html(template(obj));
		}
		
	}
	
	
	
	
	hashtagarray.sort();
	libtags["all"] = hashtagarray;	
	$("#alltags").append("<div id='lib-all'><a href='#' id='exp-all' class='tag-filter'>+</a><br><ul class='facets hidden' id='facets-all'></ul></div>");

	$.each(libtags["all"], function(i, val) {
		$("#facets-all").append("<li><span class='tag'><a href='#' id='"+val+"' data-filter='."+val+"' class='hashtag'>"+val+"</span>");
	});



}



