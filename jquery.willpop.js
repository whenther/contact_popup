//////////////////////////////////////////////////////////////////////
//  jQuery.AWill.js                                                 //
//  A jQuery library by Will Lee-Wagner                             //
//  whentheresawill.net                                             //
//////////////////////////////////////////////////////////////////////
(function ($) {
  
//////////////////////////////////////////////////////////////////////
//  addCenterPop                                                    //
//  A function to generate responsive, centered pop-ups             //
//  which can be cusomized, and returns the div to add elements to  //
//////////////////////////////////////////////////////////////////////
  $.fn.addCenterPop = function(options) {
    
    ////////////////
    // Options Hash
    ////////////////
    var settings = $.extend({
      overlayColorFallback:   'rgb(100,100,100)',
      overlayColor:           'rgba(0,0,0,0.5)',
      containerColorFallback: 'rgb(30,30,30)',
      containerColor:         'rgba(0,0,0,0.9)',
      mobileColorFallback:    'rgb(70,70,70)',
      mobileColor:            'rgba(0,0,0,0.7)',
      textColor:              'white',
      fontFamilies:           'sans-serif'
    },options||{});
    
    
    ////////////////
    // Functions
    ////////////////
    
    // build the sytlesheet for the popup
    // This keeps the user from having to add in a seperate sheet
    function styleSheet() {
      sheet = '<style class="jquery-pop">\
      body {margin:0;}\
      .pop-overlay {\
          background-color:' + settings.overlayColorFallback + ';\
          background-color:' + settings.overlayColor + ';\
          position: fixed;\
          top:0;\
          left:0;\
          width: 100%;\
          height: 100%;\
          z-index: 99;\
          display: none;\
      }\
      .pop-container {\
          position: relative;\
          background-color:' + settings.containerColorFallback + ';\
          background-color:' + settings.containerColor + ';\
          top: 50%;\
          left:50%;\
          width: 400px;\
          margin-left: -200px;\
          overflow-x: hidden;\
          color:' + settings.textColor + ';\
          text-align: center;\
          font-family:' + settings.fontFamilies + ';\
      }\
      .pop {\
          width: 90%;\
          height:100%;\
          margin: 0 auto;\
      }\
      @media screen and (max-width: 500px) {\
        .pop-up {position:fixed;}\
        .pop-overlay {background-color: none;}\
        .pop-container {\
            background-color:' + settings.mobileColorFallback + ';\
            background-color:' + settings.mobileColor + ';\
            top: 0;\
            left:0;\
            width: 100%;\
            height: 100%;\
            margin-top: 0;\
            margin-left: 0;\
        }\
        @media screen and (max-width: 500px) {\
            .pop-container {\
              overflow-y: hidden;\
              height: inherit;\
              margin-top: 0;\
            }\
      }</style>';
      
      return sheet;
    }
    
    // set height of pop-up based on height of interior
    function setHeight() {
      pop$.show();
      // save references to other parts of pop$
      var height = pop$.find('.pop').height(),
      screen = $(window).height(),
      containerHeight, overflow;
      
      pop$.hide();
      
      if (height > screen) {
        containerHeight = screen;
        overflow = 'overlay';
      }
      else if (height < 400) {
        containerHeight = 400;
        overflow = 'hidden';
      }
      else {
        containerHeight = height;
        overflow = 'hidden';
      }
      // add a stylesheet
      // do it this way, instead of with jQuery classes,
      // to be able to use media queries
      $('head style.jquery-pop').before(
        '<style class="jquery-pop-height">\
          .pop-container {\
            overflow-y: ' + overflow + ';\
            height: ' + containerHeight + 'px;\
            margin-top: ' + '-' + containerHeight/2 + 'px;\
          }\
        </style>'
      );
    }
    // get rid of pop-up stylesheet
    // so it can be recomputed later
    function removeHeight() {
      $('head style.jquery-pop-height').remove();
    }
    
    ////////////////
    // Callbacks
    ////////////////
    function popUp() {
      // set height. Do this every time, in case the window changed
      setHeight();
      pop$.fadeIn('fast');
    }
    // close popup
    function popDown() {
      pop$.fadeOut('fast',removeHeight);
    }
    
    ////////////////
    // Main
    ////////////////
    // set up pop-up html
    var pop$ = $('<div class="pop-overlay"><div class="pop-container"><div class="pop">');
    // append pop to DOM
    $('body').append(pop$);
    
    // append stylesheet
    $('head').append(styleSheet());
    
    ////////////////
    // Listeners
    ////////////////
    // click given wrapped set to bring up popup
    this.click(popUp);
    // click pop to bring it back down
    pop$.click(popDown);
    // stop clicks on the container from bringing down the popup
    pop$.find('.pop-container').click(function (e) {
      e.stopPropagation();
    });
    
    // return the internal div of the popup
    // users can append content to this div
    return pop$.find('.pop');
  };
  
  
//////////////////////////////////////////////////////////////////////
//  showCenteredMessage                                             //
//  A function to display temporary messages in the middle of a div //
//////////////////////////////////////////////////////////////////////
  $.fn.showCenteredMessage = function(message, options) {
    var msg$ = $('<div class="pop-message">' + message + '</div>');
    
    var settings = $.extend({
      backColorFallback: 'rgb(30,30,30)',
      backColor:         'rgba(0,0,0,0.5)',
      textColor:          'white',
      fontFamilies:       'sans-serif'
    },options||{});
    
    
    msg$.css({
      'background-color': settings.backColor,
      'color': settings.textColor,
      'font-family': settings.fontFamilies,
      'text-align': 'center',
      'border-radius': '20px',
      'position': 'fixed',
      'top': '50%',
      'left': '50%',
      'padding': '5px',
      'min-width': '100px'
    });
    // append the message to the given element
    // this will calculate the size of the pop
    this.append(msg$);
    
    // adjust the placement of the message
    msg$.css({
      'margin-top': '-' + msg$.height()/2 + 'px',
      'margin-left': '-' + msg$.width()/2 + 'px'
    });
    msg$.hide();
    msg$.fadeIn('slow',function() {
      msg$.fadeOut('slow');
    });
    
    return this;
  };

//////////////////////////////////////////////////////////////////////
//  ContactMe.js                                                    //
//  A jQuery plugin to generate responsive, centered pop-ups        //
//  with "contact me" content.                                      //
//  It will add in Social Media links, and send AJAX emails         //
//  This utalizes the AWill.CenterPop.js plugin.                    //
//////////////////////////////////////////////////////////////////////
  $.fn.addContactPop = function(options) {
    // options hash
    var settings = $.extend({
      emailUrl:   null,
      emailMsg:   null,
      warningColor: '#B20000',
      socialUrls: {},
      socialMsg:  null,
      socialDir:  '',
      testMode:    false,
      // CenterPop.js options
      overlayColorFallback:   'rgb(100,100,100)',
      overlayColor:           'rgba(0,0,0,0.5)',
      containerColorFallback: 'rgb(30,30,30)',
      containerColor:         'rgba(0,0,0,0.9)',
      mobileColorFallback:    'rgb(70,70,70)',
      mobileColor:            'rgba(0,0,0,0.7)',
      textColor:              'white',
      fontFamilies:           'sans-serif'
    },options||{});
    
    ////////////////
    // Functions
    ////////////////
    
    // build the markup for the popup
    function markup() {
      var pop = '';
      // set up email html
      if (settings.emailUrl) {
        pop += '<form class="email-form">';
        if (settings.emailMsg) {
          pop += ' <p class="email-label">' + settings.emailMsg + '</p>';
        }
        pop += '' +
            '<input type="test" name="email-from" id="email-from" placeholder="Your email address"/>' +
            '<textarea name="email" id="email"></textarea>' +
            '<input class="email-submit" type="submit" value="Submit"/>' +
          '</form>';
      }
      // set up social media html
      if (settings.socialUrls) {
        pop += '<div class="icon-container">';
        if (settings.socialMsg) {
          pop += '<p>' + settings.socialMsg + '</p>';
        }
        pop += '<div class="icons">';
        // add social buttons
        for (var i in settings.socialUrls) {
          var name = i;
          var url = settings.socialUrls[i];
          
          // TODO: ADD DEFAULT ICON
          pop += '<a class="icon" href="'+ url + '" target="_blank"><img src="' + settings.socialDir + name + '.png"></a>';
        }
        pop += '</div></div>';
      }
      
      return pop;
    }
    
    // build the sytlesheet for the popup
    function styleSheet() {
      sheet = '<style class="jquery-contact">\
        .pop a {text-decoration: none;}\
        .pop {font-size: 1.2em;}\
        /* email form */\
        .pop form {padding: 10px 0;}\
        .pop #email-from {\
          width: 100%;\
          font-size: 0.9em;\
        }\
        .pop .contact-warning {\
          background-color: ' + settings.warningColor + ';\
        }\
        .pop .email-label {\
          padding: 10px 0;\
          margin: 0;\
        }\
        .pop textarea {\
          width: 100%;\
          max-width: 100%;\
          margin: 5px 0;\
          padding: 5px;\
          border:0;\
          height: 200px;\
          resize: none;\
          font-family: sans-serif;\
          font-size: 0.8em;\
          /* make padding internal */\
          -webkit-box-sizing: border-box;\
          -moz-box-sizing: border-box;\
          box-sizing: border-box;\
        }\
        .pop .submit {padding: 8px;}\
        .pop input {\
          border: 0;\
          padding: 3px;\
          margin: 5px auto;\
          display: block;\
          width: 100%;\
          font-size: 1.1em;\
          /* make padding internal */\
          -webkit-box-sizing: border-box;\
          -moz-box-sizing: border-box;\
          box-sizing: border-box;\
        }\
        /* Socail Media */\
        .pop .icon-container {\
          width: 100%;\
          padding-bottom: 10px;\
          text-align: center;\
        }\
        .pop .icons {\
          text-align: center;\
          width:100%;\
        }\
        .pop .icon {\
          display: inline-block;\
          zoom: 1;\
          *display: inline;\
          position: relative;\
          width:23%;\
          max-width:32px;\
          padding: 0 1%;\
        }\
        </style>';
      
      return sheet;
    }
    
    // display a warning
    function showWarnings(fields) {
      pop$.find(fields).addClass('contact-warning');
    }
    // remove a warning
    function hideWarnings(fields) {
      pop$.find(fields).removeClass('contact-warning');
    }
    
    // Display a server message
    function displayServerMessage() {
      
    }
    
    // validate the email side
    function validateEmail() {
      var problemFields = '',
          okayFields = '',
          validated = true;
      
      // check email
      if (pop$.find('#email-from').val() === '') {
        problemFields = '#email-from';
        validated = false;
      }
      else {
        okayFields = '#email-from';
      }
      
      // check message
      if (pop$.find('#email').val() === '') {
        if (problemFields !== '') problemFields += ', ';
        problemFields += '#email';
        validated = false;
      }
      else {
        if (okayFields !== '') okayFields += ', ';
        okayFields = '#email';
      }
      
      // update warnings
      showWarnings(problemFields);
      hideWarnings(okayFields);
      return validated;
    }
    
    function sendEmailRequest() {
      if (settings.testMode) {
        console.log('Url: ' + settings.emailUrl);
        console.log(pop$.find('.email-form').serialize());
      }
      else {
        $.post(
          settings.emailUrl,
          pop$.find('.email-form').serialize(),
          function(response){
            if (response.sent) {
              // DISPLAY SENT
            }
            else {
              validateEmail();
              if (response.message) {
                // DISPLAY MESSAGE
              }
              else {
                // DISPLAY DEFAULT MESSAGE
              }
            }
          },
          "json"
        );
      }
    }
    
    ////////////////
    // Callbacks
    ////////////////
    // callback functions
    // make an image bigger
    function imgBig() {
      $(this).stop().animate({
        'width': '40px'
      }, 'fast');
    }
    // make an image smaller
    function imgSml() {
      $(this).stop().animate({
        'width': '32px'
      }, 'fast');
    }
    function sendEmail(e) {
      e.preventDefault();
      if (validateEmail()) {
        sendEmailRequest();
      }
    }
    
    ////////////////
    // Main
    ////////////////
    // set up pop-up
    var pop$ = $('#contact').addCenterPop({
      overlayColorFallback:   settings.overlayColorFallback,
      overlayColor:           settings.overlayColor,
      containerColorFallback: settings.containerColorFallback,
      containerColor:         settings.containerColor,
      mobileColorFallback:    settings.mobileColorFallback,
      mobileColor:            settings.mobileColor,
      textColor:              settings.textColor,
      fontFamilies:           settings.fontFamilies
    });
    // Append HMTL to popup object
    pop$.append(markup());
    // Append stylesheet
    $('head').append(styleSheet());
    
    ////////////////
    // Listeners
    ////////////////
    
    // send email on submit
    pop$.find('form').submit(sendEmail);
    
    // enlarge icons on hover
    pop$.find('.icon img').hover(imgBig, imgSml);
    
    // return wrapped set
    return this;
  };
})(jQuery);