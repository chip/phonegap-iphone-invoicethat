if (window.innerWidth && window.innerWidth <= 480) {
	$(document).ready(function(){
		$('#header ul').addClass('hide');
		$('#header').append('<div class="leftButton" onclick="toggleMenu()">Menu</div>');
	});
	function toggleMenu() { 
		$('#header ul').toggleClass('hide');
		$('#header .leftButton').toggleClass('pressed');
	}
}

var hist = [];
var startUrl = 'index.html';
$(document).ready(function(){
	//loadPage(startUrl);
});
function loadPage(url) {
    $('body').append('<div id="progress">Loading...</div>');
    scrollTo(0,0);
    if (url == startUrl) {
        var element = ' #header ul';
    } else {
        var element = ' #content';
    }
    $('#home').load(url + element, function() {
		var title = $('h2').html() || 'invoicethat.com';
		$('h1').html(title);
		$('h2').remove();
		$('.leftButton').remove();
		hist.unshift({'url':url, 'title':title});
		if (hist.length > 1) {
			$('#header').append('<div class="leftButton">'+hist[1].title+'</div>');
			$('#header .leftButton').click(function(){
				var thisPage = hist.shift();
				var previousPage = hist.shift();
				loadPage(previousPage.url);
			});
		}
		$('#container a').click(function(e){
			var url = e.target.href;
			alert('url = ' + url);
			if (url.match(/invoicethat.com/)) {
				e.preventDefault();
				loadPage(url);
			}
		});
		alert('removing #progress');
		$('#progress').remove();
	});
}