/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */


var jQT = new $.jQTouch({
	cacheGetRequests: false,
	preloadImages: [
		'./jqtouch/themes/apple/img/whiteButton.png'
	]
});

$(function() {
	
	// SET TO true BEFORE APP SUBMISSION
	var devel = true;
	// BUY SSL CERT FOR m.invoicethat.com
	var base_url = devel ? 'http://m.invoicethat.local' : 'http://m.invoicethat.com';
	
	$.LoadUrl = function(path) {
		var $url = base_url + path;
  		$.ajax({
			type:       "GET",
			url:        $url,
			success:    function(data, status, xhr) { $('.current#home').html(data); },
			error:		function(xhr, status, error) { alert("Error: " + error + "\nstatus = " + status); },
			beforeSend: function(xhr) { $('#progress').show(); },
			complete:	function(xhr, status) { $('#progress').hide(); } 
		 });
		return false;
	};
	
	$("a#login_link, a#pricing_link").click(function () {
		//navigator.notification.alert("alert", "title", "OK");
		return $.LoadUrl($(this).attr('href'));
	});
});