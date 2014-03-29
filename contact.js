$(function () {
    // get some references
    var contact$ = $('.contact');
    var pop$ = $('.pop-container');
    var both$ = $('.contact, .pop-container');
    
    // timer
    var timeout = null;
    
    // open popup
    var popUp = function () {
        clearTimeout(timeout);
        pop$.fadeIn('fast');
    };
    // close popup
    var popDown = function () {
        timeout = setTimeout(function () {
            pop$.fadeOut('fast');
        }, 250);
    };
    
    // make an image bigger
    var imgBig = function () {
        $(this).animate({
            'width': '40px'
        }, 'fast');
    };
    // make an image smaller
    var imgSml = function () {
        $(this).animate({
            'width': '32px'
        }, 'fast');
    };
    
    //$(this).width * 0.8 + 'px'
    // hover listener
    both$.hover(popUp, popDown);
    // icon listener
    $('.icon img').hover(imgBig, imgSml);
});