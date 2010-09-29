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

$(document).ready(function(){
	loadPage();
});
function loadPage(url) {
    $('body').append('<div id="progress">Loading...</div>');
    if (url == undefined) {
        $('#container').load('index.html #header ul', hijackLinks);
    } else {
        $('#container').load(url + ' #content', hijackLinks);
    }
}
function hijackLinks() {
    $('#container a').click(function(e){
		e.preventDefault();
		loadPage(e.target.href);
	});
    $('#progress').remove();
}