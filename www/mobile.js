/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */

var jQT = new $.jQTouch({
						//icon: 'apple-touch-icon.png',
						//startupScreen: "apple-touch-startup.png",
						statusBar: 'black-translucent',
						cacheGetRequests: false,
						preloadImages: [
										'/jqtouch/themes/jqt/img/back_button.png',
										'/jqtouch/themes/jqt/img/back_button_clicked.png',
										'/jqtouch/themes/jqt/img/button_clicked.png',
										'/jqtouch/themes/jqt/img/grayButton.png',
										'/jqtouch/themes/jqt/img/whiteButton.png',
										'/jqtouch/themes/jqt/img/loading.gif'
										]
						});

var app = {	
	load_home: function(url) {
		$.get(url, function(data) {
			  // alert('load_home url=' + url);
			  $('.current#home').html(data);
			  });
		return false;
	}
};