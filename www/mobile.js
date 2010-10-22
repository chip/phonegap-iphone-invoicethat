/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */


var jQT = new $.jQTouch({
	cacheGetRequests: false,
	preloadImages: [
		'./jqtouch/themes/apple/img/whiteButton.png'
	]
});

//alert('inside mobile.js after jQT');
$(function() {
	
	// SET TO true BEFORE APP SUBMISSION
	var devel = true;
	// BUY SSL CERT FOR m.invoicethat.com
	var base_url = devel ? 'http://m.invoicethat.local' : 'http://m.invoicethat.com';
	
	$.LoadUrl = function(path) {
		//alert('append progress to body.  path=' + path);
		$('body').append('<div id="progress">Loading...</div>');
		var $url = base_url + $(path).attr("href");
		$.get($url, function(data) {
			  //alert('phonegap: LoadUrl url=' + $url);
			  $('.current#home').html(data);
		});
		$('#progress').remove();
		return false;
	};
	

	$("a#login").click(function (e) {
		//navigator.notification.alert("alert", "title", "OK");
		return $.LoadUrl("a#login");
	});

	$("a#pricing").click(function (e) {
		return $.LoadUrl("a#pricing");
	});
});
