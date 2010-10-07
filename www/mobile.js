/*jslint white: false, onevar: true, browser: true, devel: true, undef: false, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true */
/* See http://www.jslint.com/ */

var jQT = new $.jQTouch({
	icon: './images/apple-touch-icon.png',
	statusBar: 'black-translucent',
	cacheGetRequests: false,
	preloadImages: [
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
		'./jqtouch/themes/apple/img/toolbar.png',
		'./jqtouch/themes/apple/img/toolButton.png',
		'./jqtouch/themes/apple/img/whiteButton.png'
	]
});

var devel = true;

$(function() {
	//
	// Need to setup iphone, mobile and m subdomains locally and on slice!!!
	//
	var base_url = devel ? 'http://iphone.invoicethat.local' : 'http://iphone.invoicethat.com'
	var iphone_app = {	
		load_home: function(id) {
			$('#progress').show();
			var href = $(id).attr('href');
			//alert('id=' + id + ' href=' + href);

			var url = base_url + href;
			//alert('load_home url=' + url);
			$.get(url, function(data) {
				//alert('load_home get url=' + url);
				$('.current#home').html(data);
			});
			return false;
		}
	};
  
	$("a#login").tap(function (e) {
		return iphone_app.load_home("a#login");
	});

	$("a#pricing").tap(function (e) {
		return iphone_app.load_home("a#pricing");
	});
});
