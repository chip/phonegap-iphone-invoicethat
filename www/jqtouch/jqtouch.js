/*

            _/    _/_/    _/_/_/_/_/                              _/
               _/    _/      _/      _/_/    _/    _/    _/_/_/  _/_/_/
          _/  _/  _/_/      _/    _/    _/  _/    _/  _/        _/    _/
         _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/
        _/    _/_/  _/    _/      _/_/      _/_/_/    _/_/_/  _/    _/
       _/
    _/

    Created by David Kaneda <http://www.davidkaneda.com>
    Documentation and issue tracking on Google Code <http://code.google.com/p/jqtouch/>

    Special thanks to Jonathan Stark <http://jonathanstark.com/>
    and pinch/zoom <http://www.pinchzoom.com/>

    (c) 2009 by jQTouch project members.
    See LICENSE.txt for license.

    $Revision: 135 $
    $Date: 2010-03-14 17:42:28 -0500 (Sun, 14 Mar 2010) $
    $LastChangedBy: davidcolbykaneda $

*/

(function($) {
    $.jQTouch = function(options) {

        // Set support values
        $.support.WebKitCSSMatrix = (typeof WebKitCSSMatrix == "object");
        $.support.touch = (typeof Touch == "object");
        $.support.WebKitAnimationEvent = (typeof WebKitTransitionEvent == "object");

        // Initialize internal variables
        var $body,
            $head=$('head'),
            hist=[],
            newPageCount=0,
            jQTSettings={},
	        hashCheckInterval,
            currentPage,
            orientation,
            isMobileWebKit = RegExp(" Mobile/").test(navigator.userAgent),
            tapReady=true,
            lastAnimationTime=0,
            touchSelectors=[],
            publicObj={},
            extensions=$.jQTouch.prototype.extensions,
            defaultAnimations=['slide','flip','slideup','swap','cube','pop','dissolve','fade','back'],
            animations=[],
            hairextensions='';
        // Get the party started
        init(options);

        function init(options) {

            var defaults = {
                addGlossToIcon: true,
                backSelector: '.back, .cancel, .goback',
                cacheGetRequests: true,
                cubeSelector: '.cube',
                dissolveSelector: '.dissolve',
                fadeSelector: '.fade',
                fixedViewport: true,
                flipSelector: '.flip',
                formSelector: 'form',
                fullScreen: true,
                fullScreenClass: 'fullscreen',
                icon: null,
                touchSelector: 'a, .touch',
                popSelector: '.pop',
                preloadImages: false,
                slideSelector: '#jqt > * > ul li a, .slide',
                slideupSelector: '.slideup',
                startupScreen: null,
                statusBar: 'default', // other options: black-translucent, black
                submitSelector: '.submit',
                swapSelector: '.swap',
                useAnimations: true,
                useFastTouch: true // Experimental.
            };
            jQTSettings = $.extend({}, defaults, options);

            // Preload images
            if (jQTSettings.preloadImages) {
                for (var i = jQTSettings.preloadImages.length - 1; i >= 0; i--) {
                    (new Image()).src = jQTSettings.preloadImages[i];
                };
            }
            // Set icon
            if (jQTSettings.icon) {
                var precomposed = (jQTSettings.addGlossToIcon) ? '' : '-precomposed';
                hairextensions += '<link rel="apple-touch-icon' + precomposed + '" href="' + jQTSettings.icon + '" />';
            }
            // Set startup screen
            if (jQTSettings.startupScreen) {
                hairextensions += '<link rel="apple-touch-startup-image" href="' + jQTSettings.startupScreen + '" />';
            }
            // Set viewport
            if (jQTSettings.fixedViewport) {
                hairextensions += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>';
            }
            // Set full-screen
            if (jQTSettings.fullScreen) {
                hairextensions += '<meta name="apple-mobile-web-app-capable" content="yes" />';
                if (jQTSettings.statusBar) {
                    hairextensions += '<meta name="apple-mobile-web-app-status-bar-style" content="' + jQTSettings.statusBar + '" />';
                }
            }
            if (hairextensions) {
                $head.prepend(hairextensions);
            }

            // Initialize on document ready:
            $(document).ready(function() {

                // Add extensions
                for (var i in extensions) {
                    var fn = extensions[i];
                    if ($.isFunction(fn)) {
                        $.extend(publicObj, fn(publicObj));
                    }
                }

                // Add animations
                for (var i in defaultAnimations) {
                    var name = defaultAnimations[i];
                    var selector = jQTSettings[name + 'Selector'];
                    if (typeof(selector) == 'string') {
                        addAnimation({name:name, selector:selector});
                    }
                }

                touchSelectors.push('input');
                touchSelectors.push(jQTSettings.touchSelector);
                touchSelectors.push(jQTSettings.backSelector);
                touchSelectors.push(jQTSettings.submitSelector);
                $(touchSelectors.join(', ')).css('-webkit-touch-callout', 'none');
                $(jQTSettings.backSelector).tap(liveTap);
                $(jQTSettings.submitSelector).tap(submitParentForm);

                $body = $('#jqt');

                if (jQTSettings.fullScreenClass && window.navigator.standalone == true) {
                    $body.addClass(jQTSettings.fullScreenClass + ' ' + jQTSettings.statusBar);
                }

                // Create custom live events
                $body
                    .bind('touchstart', handleTouch)
                    .bind('orientationchange', updateOrientation)
                    .trigger('orientationchange')
                    .submit(submitForm);

                if (jQTSettings.useFastTouch && $.support.touch) {
                    $body.click(function(e) {
                        var $el = $(e.target);

                        if ($el.attr('nodeName')!=='A' && $el.attr('nodeName')!=='AREA' && $el.attr('nodeName')!=='INPUT') {
                            $el = $el.closest('a, area');
                        }

                        if ($el.isExternalLink()) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    // This additionally gets rid of form focusses
                    $body.mousedown(function(e) {
                        var timeDiff = (new Date()).getTime() - lastAnimationTime;
                        if (timeDiff < 200) {
                            return false;
                        }
                    });
                }

                // Make sure exactly one child of body has "current" class
                if ($('#jqt > .current').length == 0) {
                    currentPage = $('#jqt > *:first');
                } else {
                    currentPage = $('#jqt > .current:first');
                    $('#jqt > .current').removeClass('current');
                }

                // Go to the top of the "current" page
                $(currentPage).addClass('current');
                location.hash = '#' + $(currentPage).attr('id');
                addPageToHistory(currentPage);
                scrollTo(0, 0);
                startHashCheck();
            });
        }

        // PUBLIC FUNCTIONS
        function goBack(to) {
            // Init the param
            var numberOfPages = Math.min(parseInt(to || 1, 10), hist.length-1),
                curPage = hist[0];

            // Search through the history for an ID
            if(isNaN(numberOfPages) && typeof(to) === "string" && to != '#' ) {
                for( var i=1, length=hist.length; i < length; i++ ) {
                    if( '#' + hist[i].id === to ) {
                        numberOfPages = i;
                        break;
                    }
                }
            }

            // If still nothing, assume one
            if(isNaN(numberOfPages) || numberOfPages < 1) {
                numberOfPages = 1;
            };

            if (hist.length > 1) {
                // Remove all pages in front of the target page
                hist.splice(0, numberOfPages);
                animatePages(curPage.page, hist[0].page, curPage.animation, curPage.reverse === false);
            } else {
                location.hash = '#' + curPage.id;
            }

            return publicObj;
        }
        function goTo(toPage, animation, reverse) {
            var fromPage = hist[0].page;

            if (typeof(toPage) === 'string') {
                toPage = $(toPage);
            }
            if (typeof(animation) === 'string') {
                for (var i = animations.length - 1; i >= 0; i--) {
                    if (animations[i].name === animation) {
                        animation = animations[i];
                        break;
                    }
                }
            }
            if (animatePages(fromPage, toPage, animation, reverse)) {
                addPageToHistory(toPage, animation, reverse);
                return publicObj;
            } else {
                console.error('Could not animate pages.');
                return false;
            }
        }
        function getOrientation() {
            return orientation;
        }

        // PRIVATE FUNCTIONS
        function liveTap(e){

            // Grab the clicked element
            var $el = $(e.target);

            if ($el.attr('nodeName')!=='A' && $el.attr('nodeName')!=='AREA') {
                $el = $el.closest('a, area');
            }

            var target = $el.attr('target'),
                hash = $el.attr('hash'),
                animation=null;

            if (tapReady == false || !$el.length) {
                console.warn('Not able to tap element.');
                return false;
            }

            if ($el.isExternalLink()) {
                $el.removeClass('active');
                return true;
            }

            // Figure out the animation to use
            for (var i = animations.length - 1; i >= 0; i--) {
                if ($el.is(animations[i].selector)) {
                    animation = animations[i];
                    break;
                }
            };

            // User clicked an internal link, fullscreen mode
            if (target == '_webapp') {
                window.location = $el.attr('href');
            }
            // User clicked a back button
            else if ($el.is(jQTSettings.backSelector)) {
                goBack(hash);
            }
            // Allow tap on item with no href
            else if ($el.attr('href') == '#') {
                $el.unselect();
                return true;
            }
            // Branch on internal or external href
            else if (hash && hash!='#') {
                $el.addClass('active');
                goTo($(hash).data('referrer', $el), animation, $(this).hasClass('reverse'));
            } else {
                $el.addClass('loading active');
                showPageByHref($el.attr('href'), {
                    animation: animation,
                    callback: function() {
                        $el.removeClass('loading'); setTimeout($.fn.unselect, 250, $el);
                    },
                    $referrer: $el
                });
            }
            return false;
        }
        function addPageToHistory(page, animation, reverse) {
            // Grab some info
            var pageId = page.attr('id');
            // Prepend info to page history
            hist.unshift({
                page: page,
                animation: animation,
                reverse: reverse || false,
                id: pageId
            });
        }
        function animatePages(fromPage, toPage, animation, backwards) {
            // Error check for target page
            if (toPage.length === 0) {
                $.fn.unselect();
                console.error('Target element is missing.');
                return false;
            }

            // Error check for fromPage=toPage
            if (toPage.hasClass('current')) {
                $.fn.unselect();
                console.error('Target element is the current page.');
                return false;
            }

            // Collapse the keyboard
            $(':focus').blur();

            // Make sure we are scrolled up to hide location bar
            scrollTo(0, 0);

            // Define callback to run after animation completes
            var callback = function animationEnd(event) {
                if (animation) {
                    toPage.removeClass('in ' + animation.name);
                    fromPage.removeClass('current out ' + animation.name);
                    if (backwards) {
                        toPage.toggleClass('reverse');
                        fromPage.toggleClass('reverse');
                    }
                } else {
                    fromPage.removeClass('current');
                }

                toPage.trigger('pageAnimationEnd', { direction: 'in' });
                fromPage.trigger('pageAnimationEnd', { direction: 'out' });

                clearInterval(hashCheckInterval);
                currentPage = toPage;
                location.hash = '#' + currentPage.attr('id');
                startHashCheck();

                var $originallink = toPage.data('referrer');
                if ($originallink) {
                    $originallink.unselect();
                }
                lastAnimationTime = (new Date()).getTime();
                tapReady = true;
            }

            fromPage.trigger('pageAnimationStart', { direction: 'out' });
            toPage.trigger('pageAnimationStart', { direction: 'in' });

            if ($.support.WebKitAnimationEvent && animation && jQTSettings.useAnimations) {
                toPage.one('webkitAnimationEnd', callback);
                tapReady = false;
                if (backwards) {
                    toPage.toggleClass('reverse');
                    fromPage.toggleClass('reverse');
                }
                toPage.addClass(animation.name + ' in current ');
                fromPage.addClass(animation.name + ' out');

            } else {
                toPage.addClass('current');
                callback();
            }

            return true;
        }
        function hashCheck() {
            var curid = currentPage.attr('id');
            if (location.hash == '') {
                location.hash = '#' + curid;
            } else if (location.hash != '#' + curid) {
                clearInterval(hashCheckInterval);
                goBack(location.hash);
            }
        }
        function startHashCheck() {
            hashCheckInterval = setInterval(hashCheck, 100);
        }
        function insertPages(nodes, animation) {
            var targetPage = null;
            $(nodes).each(function(index, node) {
                var $node = $(this);
                if (!$node.attr('id')) {
                    $node.attr('id', 'page-' + (++newPageCount));
                }

		        $body.trigger('pageInserted', {page: $node.appendTo($body)});

                if ($node.hasClass('current') || !targetPage) {
                    targetPage = $node;
                }
            });
            if (targetPage !== null) {
                goTo(targetPage, animation);
                return targetPage;
            } else {
                return false;
            }
        }
        function showPageByHref(href, options) {
            var defaults = {
                data: null,
                method: 'GET',
                animation: null,
                callback: null,
                $referrer: null
            };

            var settings = $.extend({}, defaults, options);

            if (href != '#') {
                $.ajax({
                    url: href,
                    data: settings.data,
                    type: settings.method,
                    success: function (data, textStatus) {
                        var firstPage = insertPages(data, settings.animation);
                        if (firstPage) {
                            if (settings.method == 'GET' && jQTSettings.cacheGetRequests === true && settings.$referrer) {
                                settings.$referrer.attr('href', '#' + firstPage.attr('id'));
                            }
                            if (settings.callback) {
                                settings.callback(true);
                            }
                        }
                    },
                    error: function (data) {
                        if (settings.$referrer) {
                            settings.$referrer.unselect();
                        }
                        if (settings.callback) {
                            settings.callback(false);
                        }
                    }
                });
            }
            else if (settings.$referrer) {
                settings.$referrer.unselect();
            }
        }
        function submitForm(e, callback) {
            var $form = (typeof(e)==='string') ? $(e).eq(0) : (e.target ? $(e.target) : $(e));

            if ($form.length && $form.is(jQTSettings.formSelector)) {
                showPageByHref($form.attr('action'), {
                    data: $form.serialize(),
                    method: $form.attr('method') || "POST",
                    animation: animations[0] || null,
                    callback: callback
                });
                return false;
            }
            return true;
        }
        function submitParentForm(e) {
            var $form = $(this).closest('form');
            if ($form.length) {
                evt = jQuery.Event("submit");
                evt.preventDefault();
                $form.trigger(evt);
                return false;
            }
            return true;
        }
        function addAnimation(animation) {
            if (typeof(animation.selector) == 'string' && typeof(animation.name) == 'string') {
                animations.push(animation);
                $(animation.selector).tap(liveTap);
                touchSelectors.push(animation.selector);
            }
        }
        function updateOrientation() {
            orientation = window.innerWidth < window.innerHeight ? 'profile' : 'landscape';
            $body.removeClass('profile landscape').addClass(orientation).trigger('turn', {orientation: orientation});
            // scrollTo(0, 0);
        }
        function handleTouch(e) {
            var $el = $(e.target);
            
            // Only handle touchSelectors
            if (!$(e.target).is(touchSelectors.join(', '))) {
                var $link = $(e.target).closest('a, area');
                
                if ($link.length && $link.is(touchSelectors.join(', '))) {
                    $el = $link;
                } else {
                    return;
                }
            }
            
            if (e) {
                var hoverTimeout = null,
                    startX = event.changedTouches[0].clientX,
                    startY = event.changedTouches[0].clientY,
                    startTime = (new Date).getTime(),
                    deltaX = 0,
                    deltaY = 0,
                    deltaT = 0;

                // Let's bind these after the fact, so we can keep some internal values
                $el.bind('touchmove', touchmove).bind('touchend', touchend);

                hoverTimeout = setTimeout(function() {
                    $el.makeActive();
                }, 100);

            }

            // Private touch functions (TODO: insert dirty joke)
            function touchmove(e) {

                updateChanges();
                var absX = Math.abs(deltaX);
                var absY = Math.abs(deltaY);

                // Check for swipe
                if (absX > absY && (absX > 35) && deltaT < 1000) {
                    $el.trigger('swipe', {direction: (deltaX < 0) ? 'left' : 'right', deltaX: deltaX, deltaY: deltaY }).unbind('touchmove touchend');
                } else if (absY > 1) {
                    $el.removeClass('active');
                }

                clearTimeout(hoverTimeout);
            } 

            function touchend() {
                updateChanges();

                if (deltaY === 0 && deltaX === 0) {
                    $el.makeActive();
                    $el.trigger('tap');
                } else {
                    $el.removeClass('active');
                }
                $el.unbind('touchmove touchend');
                clearTimeout(hoverTimeout);
            }

            function updateChanges() {
                var first = event.changedTouches[0] || null;
                deltaX = first.pageX - startX;
                deltaY = first.pageY - startY;
                deltaT = (new Date).getTime() - startTime;
            }

        } // End touch handler

        // Public jQuery Fns
        $.fn.unselect = function(obj) {
            if (obj) {
                obj.removeClass('active');
            } else {
                $('.active').removeClass('active');
            }
        }
        $.fn.makeActive = function() {
            return $(this).addClass('active');
        }
        $.fn.swipe = function(fn) {
            if ($.isFunction(fn)) {
                return $(this).bind('swipe', fn);
            } else {
                return $(this).trigger('swipe');
            }
        }
        $.fn.tap = function(fn) {
            if ($.isFunction(fn)) {
                var tapEvent = (jQTSettings.useFastTouch && $.support.touch) ? 'tap' : 'click';
                return $(this).live(tapEvent, fn);
            } else {
                return $(this).trigger('tap');
            }
        }
        $.fn.isExternalLink = function() {
            var $el = $(this);
            return ($el.attr('target') == '_blank' || $el.attr('rel') == 'external' || $el.is('input[type="checkbox"], input[type="radio"], a[href^="http://maps.google.com:"], a[href^="mailto:"], a[href^="tel:"], a[href^="javascript:"], a[href*="youtube.com/v"], a[href*="youtube.com/watch"]'));
        }

        publicObj = {
            getOrientation: getOrientation,
            goBack: goBack,
            goTo: goTo,
            addAnimation: addAnimation,
            submitForm: submitForm
        }

        return publicObj;
    }

    // Extensions directly manipulate the jQTouch object, before it's initialized.
    $.jQTouch.prototype.extensions = [];
    $.jQTouch.addExtension = function(extension) {
        $.jQTouch.prototype.extensions.push(extension);
    }

})(jQuery);