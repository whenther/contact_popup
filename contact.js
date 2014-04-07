$(function () {
    // build a pop-up
    var buildPop = function () {
        var pop$ = $('<div class="pop-container">').append(
            $('<div class="pop">').append(
                $('<form>').
                append('<p class="email-label">').
                append('<input type="test" name="email-from" id="email-from" placeholder="Your email address"/>').
                append('<span class="warn">Please enter a valid email address.</span>').
                append('<textarea id="email">').
                append('<span class="warn">Please enter a message.</span>').
                append('<input class="submit" type="button" value="Submit"/>')
            ).append(
                $('<div class="icon-container">').
                append('<p>Follow me on social media!</p>').
                append('<div class="icons">')
            )
        )
        
        return pop$;
    };    
    
    //------------//
    // vars       //
    //------------//
  
    // get some references
    var contact$ = $('.contact'),
        pop$ = $('.pop-container'),
        both$ = $('.contact, .pop-container');
    
    // set up pop state
    var popup = { 
        locked: false,
        up: false
    };
    
    // timer
    var timeout = null;
    
    //------------//
    // setup pop  //
    //------------//
    var popup$ = 
    
    //------------//
    // callbacks  //
    //------------//
    // open popup
    var popUp = function () {
        if (!(popup.locked)) {
            clearTimeout(timeout);
            pop$.fadeIn('fast');
            popup.up = true;
        }
    };
    // close popup
    var popDown = function () {
        if (!(popup.locked)) {
            timeout = setTimeout(function () {
                pop$.fadeOut('fast');
                popup.up = false;
            }, 250);
        }
    };
    
    // make an image bigger
    var imgBig = function () {
        $(this).stop().animate({
            'width': '40px'
        }, 'fast');
    };
    // make an image smaller
    var imgSml = function () {
        $(this).stop().animate({
            'width': '32px'
        }, 'fast');
    };
    
    //------------//
    // listeners  //
    //------------//
    // hover listener
    both$.hover(popUp, popDown);
    both$.children('.icon img').click(function (e) {
        e.stopPropagation();
    });
    // click listener
    both$.click(function (e) {
        if (popup.locked) {
            popup.locked = false;
            popDown();
        }
        else {
            popUp();
            popup.locked = true;
        }
    });
    // icon listener
    $('.icon img').hover(imgBig, imgSml);
});