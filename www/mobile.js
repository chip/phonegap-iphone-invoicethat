/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */


var jQT = new $.jQTouch({
	cacheGetRequests: false,
	useFastTouch: true,
	preloadImages: [
		'/images/logo.png',
		'./jqtouch/themes/apple/img/actionButton.png',
		'./jqtouch/themes/apple/img/backButton.png',
		'./jqtouch/themes/apple/img/blueButton.png',
		'./jqtouch/themes/apple/img/cancel.png',
		'./jqtouch/themes/apple/img/chevron.png',
		'./jqtouch/themes/apple/img/grayButton.png',
		'./jqtouch/themes/apple/img/greenButton.png',
		'./jqtouch/themes/apple/img/listArrowSel.png',
		'./jqtouch/themes/apple/img/listGroup.png',
		'./jqtouch/themes/apple/img/loading.gif',
		'./jqtouch/themes/apple/img/on_off.png',
		'./jqtouch/themes/apple/img/pinstripes.png',
		'./jqtouch/themes/apple/img/redButton.png',
		'./jqtouch/themes/apple/img/selection.png',
		'./jqtouch/themes/apple/img/thumb.png',
		'./jqtouch/themes/apple/img/toggle.png',
		'./jqtouch/themes/apple/img/toggleOn.png',
		'./jqtouch/themes/apple/img/toolButton.png',
		'./jqtouch/themes/apple/img/toolbar.png',
		'./jqtouch/themes/apple/img/whiteButton.png'
	]
});

$(function() {

  //debug.log('before setting devel');
  
	// SET TO true BEFORE APP SUBMISSION
	var devel = true;
	// BUY SSL CERT FOR m.invoicethat.com
	var base_url = devel ? 'http://m.invoicethat.local' : 'http://m.invoicethat.com';
	
	$.LoadUrlPhoneGap = function(path) {
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
		return $.LoadUrlPhoneGap($(this).attr('href'));
	});


});