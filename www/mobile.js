/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */

var jQT = new $.jQTouch({
	icon: './images/apple-touch-icon.png',
	statusBar: 'black-translucent',
	cacheGetRequests: false,
	preloadImages: [
		'./jqtouch/themes/apple/img/chevron_circle.png',
		'./jqtouch/themes/apple/img/back_button_clicked.png',
		'./jqtouch/themes/apple/img/button_clicked.png'
	]
});

$(function() {

	var app = {	
		load_home: function(url) {
			alert('load_home url=' + url);
			$('body').append('<div id="progress">Loading...</div>');
			alert('load_home progress');
			$.get(url, function(data) {
				alert('load_home get url=' + url);
				$('.current#home').html(data);
			});
			alert('load_home progress remove');
			$('#progress').remove();
			return false;
		}
	};
  
	$("a#login").tap(function (e) {
		alert('tap a#login');
		return app.load_home("http://invoicethat.local/login");
	});

	$("a#signup").tap(function (e) {
		alert('tap a#signup');
		return app.load_home("http://invoicethat.local/signup");
	});
});
