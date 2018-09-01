/*!
 * File:        ./src/assets/js/front/front.js
 * Copyright(c) 2016-2018 Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

jQuery(function ($) {

  'use strict';

  let defs = {
      selector: 'div'
    , inclass:  ''
    , outclass: ''
  };

  /* ------------------------------------------------------------------------ /*
   *  Waypoints
  /* ------------------------------------------------------------------------ */

  let wShow = function (o) {
    let opts = Object.assign(Object.create(Object.prototype), defs, o || {});

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
    $.noty.defaults = {
        layout:       'topRight'
      , theme:        'defaultTheme'      // or relax
      , type:         'success'           // alert, success, error, warning, information, notification
      , text:         ''                  // [string|html] can be HTML or STRING
      , dismissQueue: true                // [boolean] If you want to use queue feature set this true
      , force:        false               // [boolean] adds notification to the beginning of queue when set to true
      , maxVisible:   8                   // [integer] you can set max visible notification count for dismissQueue true option,
      , template:     '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
      , timeout:      5000                // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
      , progressBar:  true                // [boolean] - displays a progress bar
      , buttons:      false               // [boolean|array] an array of buttons, for creating confirmation dialogs.
      , animation: {
            open:     {height: 'toggle'}  // or Animate.css class names like: 'animated bounceInLeft'
          , close:    'animated flipOutY' // or Animate.css class names like: 'animated bounceOutLeft'
          , easing:   'swing'
          , speed:    700                 // opening & closing animation speed
        }
      , closeWith:    ['click']           // ['click', 'button', 'hover', 'backdrop']     // backdrop click will close all notifications
      , modal:        false               // [boolean] if true adds an overlay
      , killer:       false               // [boolean] if true closes all notifications and shows itself
      , callback: {
            onShow:       function () {}
          , afterShow:    function () {}
          , onClose:      function () {}
          , afterClose:   function () {}
          , onCloseClick: function () {}
        }
    };
  }());


  // ---------------------------------------------------------------------------
  //  Waypoints
  // ---------------------------------------------------------------------------

  (function () {

    'use strict';

    let d = document;
    let w = window;
    let data_root = w.location.origin + '/data/';

    // Examine the text in the response
    function status (r) {
      if (r.status >= 200 && r.status < 300) {
        return Promise.resolve(r);
      } else {
        console.warn('Looks like there was a problem. Status Code: ' + r.status);
        return Promise.reject(new Error(r.statusText));
      }
    }


    // Parse response text into javascript object
    function json (r) {
      let contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    }


    // Get response text
    function text (r) {
      return r.text();
    }


    let AnimationsConfig = fetch(data_root + 'animations.json')
      .then(status)
      .then(json)
      .then(function (lo) {
        // console.log('Fetch Request succeeded with JSON response (', typeof lo, '): [', lo, ']');
        return Promise.resolve(lo.animations);
      })
      .catch(function (err) {
        console.warn('Failed to fetch DATA: [', err, ']');
      });


    let AnimationsEnabled = AnimationsConfig.then(function (loAnimations) {

      return Promise.resolve(loAnimations).then(function (lo) {
        return new Promise(function (resolve, reject) {

          $.each(lo, function (i, o) {
            wShow(o);
          });

          resolve();

        });
      });

    })
    .catch(function (e) {
      console.warn('Failed to Enable Animations: [', e, ']');
    });

  })();


  // ---------------------------------------------------------------------------
  //  Notifications
  // ---------------------------------------------------------------------------

  (function () {

    $(window).on('load', function () {
      console.log('SHOWING INTRO NOTIFICATION');
      noty({
          text:    'Content was last updated at 2018-09-01'
        , timeout: 10000
        , type:    'information'
      });
    });

  })();

});
