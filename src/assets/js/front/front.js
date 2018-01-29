/*!
 * File:        ./src/assets/js/front/front.js
 * Copyright(c) 2016-2018 Baltrushaitis Tomas
 * License:     MIT
 */

jQuery(function ($) {
  'use strict';

  var defs = {
      selector: 'div'
    , inclass:  ''
    , outclass: ''
  };

  /* ------------------------------------------------------------------------ /*
   *  Waypoints
  /* ------------------------------------------------------------------------ */

  var wShow = function (o) {
    var opts = $.extend(Object.create(Object.prototype), defs, o || {});
    // console.log('opts = [', opts, ']');

    new Waypoint.Inview({
        element: $(opts.selector)
      , enter: function (dir) {
          // console.log('enter() for ', this.element , dir);
          this.element.removeClass(opts.outclass).addClass(opts.inclass);
        }
      , entered: function (dir) {
          // noty({text: 'Entered triggered with direction ' + dir, type: 'information'});
        }
      , exit: function (dir) {
          // noty({text: 'Exit triggered with direction ' + dir, type: 'notification'});
          // console.log('exit() for ', this.element , dir);
        }
      , exited: function (dir) {
          // console.log('exited() for ', this.element , dir);
          this.element.removeClass(opts.inclass).addClass(opts.outclass);
        }
      , offset: function () {
          // console.info('this.element.clientHeight = ', this.element.clientHeight);
          return 70 + this.element.clientHeight;
        }
    });

/*
        // , offset: opts.offset
        // , offset: '-50%'
*/

  };


  // ---------------------------------------------------------------------------
  //  NOTY options
  // ---------------------------------------------------------------------------

  (function () {
    $.noty.defaults =   {
        layout:         'topRight'
      , theme:          'defaultTheme'      // or relax
      , type:           'success'           // alert, success, error, warning, information, notification
      , text:           ''                  // [string|html] can be HTML or STRING
      , dismissQueue:   true                // [boolean] If you want to use queue feature set this true
      , force:          false               // [boolean] adds notification to the beginning of queue when set to true
      , maxVisible:     8                   // [integer] you can set max visible notification count for dismissQueue true option,
      , template:       '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
      , timeout:        5000                // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
      , progressBar:    true                // [boolean] - displays a progress bar
      , animation: {
            open:       {height: 'toggle'}  // or Animate.css class names like: 'animated bounceInLeft'
          , close:      'animated flipOutY' // or Animate.css class names like: 'animated bounceOutLeft'
          , easing:     'swing'
          , speed:      700                 // opening & closing animation speed
        }
      , closeWith:      ['click']           // ['click', 'button', 'hover', 'backdrop']     // backdrop click will close all notifications
      , modal:          false               // [boolean] if true adds an overlay
      , killer:         false               // [boolean] if true closes all notifications and shows itself
      , callback: {
            onShow:         function () {}
          , afterShow:      function () {}
          , onClose:        function () {}
          , afterClose:     function () {}
          , onCloseClick:   function () {}
        }
      , buttons:    false               // [boolean|array] an array of buttons, for creating confirmation dialogs.
    };
  }());


  // ---------------------------------------------------------------------------
  //  Waypoints
  // ---------------------------------------------------------------------------

  (function () {
    var lAnimations =   [
        {}
      , {   selector:   '#about .section-title'
          , inclass:    'fadeInDown'
          , outclass:   'fadeOutDown'
        }
      , {   selector:   '.intro-sub'
          , inclass:    'zoomInUp'
          , outclass:   'zoomOutDown'
        }
      , {   selector:   '.intro h1'
          , inclass:    'zoomIn'
          , outclass:   'zoomOut'
        }
      , {   selector:   '.intro p'
          , inclass:    'rotateIn'
          , outclass:   'rotateOut'
        }
      , {   selector:   '#social-icons ul.list-inline > li'
          , inclass:    'rollIn'
          , outclass:   'rollOut'
        }
      , {   selector:   '#avatar'
          , inclass:    'flip'
          , outclass:   'rubberBand'
        }
      , {   selector:   '#objective h3'
          , inclass:    'lightSpeedIn'
          , outclass:   'lightSpeedOut'
        }
      , {   selector:   '#objective p'
          , inclass:    'fadeInLeft'
          , outclass:   'fadeOutLeft'
        }
      , {   selector:   '#scopes h3'
          , inclass:    'lightSpeedIn'
          , outclass:   'lightSpeedOut'
        }
      , {   selector:   '#scope-01'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#scope-02'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#scope-03'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#scope-04'
          , inclass:    'rotateInDownRight'
          , outclass:   'rotateOutDownRight'
        }
      , {   selector:   '#scope-05'
          , inclass:    'fadeInRightBig'
          , outclass:   'fadeOutRightBig'
        }
      , {   selector:   '#scope-06'
          , inclass:    'fadeInUpBig'
          , outclass:   'fadeOutUpBig'
        }
      , {   selector:   '#scope-07'
          , inclass:    'fadeInUpBig'
          , outclass:   'fadeOutUpBig'
        }
      , {   selector:   '#scope-08'
          , inclass:    'fadeInRightBig'
          , outclass:   'fadeOutRightBig'
        }
      , {   selector:   '#selfie h3'
          , inclass:    'fadeInRight'
          , outclass:   'fadeOutRight'
        }
      , {   selector:   '#selfie p'
          , inclass:    'fadeInLeft'
          , outclass:   'fadeOutLeft'
        }
      , {   selector:   '#whatido h3'
          , inclass:    'fadeInRight'
          , outclass:   'fadeOutRight'
        }
      , {   selector:   '#whatido p'
          , inclass:    'fadeInLeft'
          , outclass:   'fadeOutLeft'
        }
      , {   selector:   '#whatido-01'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#whatido-02'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#whatido-03'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#whatido-04'
          , inclass:    'rotateInDownRight'
          , outclass:   'rotateOutDownRight'
        }
      , {   selector:   '#whatido-05'
          , inclass:    'fadeInRightBig'
          , outclass:   'fadeOutRightBig'
        }
      , {   selector:   '#whatido-06'
          , inclass:    'fadeInUpBig'
          , outclass:   'fadeOutUpBig'
        }
      , {   selector:   '#whatido-07'
          , inclass:    'fadeInUpBig'
          , outclass:   'fadeOutUpBig'
        }
      , {   selector:   '#whatido-08'
          , inclass:    'fadeInRightBig'
          , outclass:   'fadeOutRightBig'
        }
      , {   selector:   '#whatido-09'
          , inclass:    'bounceInLeft'
          , outclass:   'bounceOutLeft'
        }
      , {   selector:   '#whatido-10'
          , inclass:    'rotateInUpRight'
          , outclass:   'rotateOutUpRight'
        }
      , {   selector:   '#resume .section-title'
          , inclass:    'fadeInDown'
          , outclass:   'fadeOutDown'
        }
      , {   selector:   '#edu'
          , inclass:    'fadeInUp'
          , outclass:   'fadeOutUp'
        }
      , {   selector:   '#car'
          , inclass:    'fadeInUp'
          , outclass:   'fadeOutUp'
        }
      , {   selector:   '#edu-01'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#edu-02'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#car-01'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#car-02'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#car-03'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#car-04'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#car-05'
          , inclass:    'flipInY'
          , outclass:   'flipOutY'
        }
      , {   selector:   '#skills .section-title'
          , inclass:    'fadeInDown'
          , outclass:   'fadeOutDown'
        }
      , {   selector:   '#portfolio .section-title'
          , inclass:    'fadeInDown'
          , outclass:   'fadeOutDown'
        }
      , {   selector:   '#contact .section-title'
          , inclass:    'fadeInDown'
          , outclass:   'fadeOutDown'
        }
    ];

    $.each(lAnimations, function (i, o) {
      wShow(o);
    });

  })();


  // ---------------------------------------------------------------------------
  //  Notifications
  // ---------------------------------------------------------------------------

  (function () {

    noty({
        text:    'Content was last updated at 2018-01-28'
      , timeout: 10000
      , type:    'information'
    });

  })();

});
