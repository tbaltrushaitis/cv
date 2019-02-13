/* jshint unused:false */
/*!
 * Project:     {{app.name}}
 * File:        ./src/assets/js/front/index.js
 * Copyright(c) 2016-nowdays {{author.name.full}} <{{author.email}}>
 * License:     {{project.license}}
 */

'use strict';

window.jQuery(($) => {

  let defOpts = Object.assign({}, {
    selector: 'div'
    , inclass:  ''
    , outclass: ''
  });

  /* ------------------------------------------------------------------------ /*
   *  Waypoints
  /* ------------------------------------------------------------------------ */

  let wShow = (o) => {
    let opts = Object.assign({}, defOpts || {}, o || {});

    new window.Waypoint.Inview({
      element: $(opts.selector)
      , enter: function (dir) {
          // console.log('Enter fired for', this.element , dir);
          this.element.removeClass(opts.outclass).addClass(opts.inclass);
        }
      , entered: function (dir) {
          // noty({text: 'Entered fired with direction ' + dir, type: 'information'});
        }
      , exit: function (dir) {
          // noty({text: 'Exit fired with direction ' + dir, type: 'notification'});
          // console.log('exit() for ', this.element , dir);
        }
      , exited: function (dir) {
          // console.log('Exited fired for ', this.element , dir);
          this.element.removeClass(opts.inclass).addClass(opts.outclass);
        }
      , offset: opts.offset || '-50%'
    });

    // , offset: function () {
    //     // console.info('this.element.clientHeight = ', this.element.clientHeight);
    //     return 70 + this.element.clientHeight;
    //   }

  };

  // ---------------------------------------------------------------------------
  //  Animations
  // ---------------------------------------------------------------------------

  (function () {

    let w = window;
    let dataRoot = w.location.origin + '/data/';

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
      }else if (contentType && contentType.includes('text/plain')) {
        return JSON.parse(r);
      }
      throw new TypeError('Oops, we haven\'t got JSON!');
    }

    // Get response text
    function text (r) {
      return r.text();
    }

    // Fetch animations configuration
    let AnimationsConfig = fetch(dataRoot + 'animations.json')
      .then(status)
      .then(json)
      .then(function (lo) {
        // console.log('Fetch Request succeeded with JSON response (', typeof lo, '): [', lo, ']');
        return Promise.resolve(lo.animations);
      })
      .catch(function (err) {
        console.warn('Failed to fetch DATA: [', err, ']');
        return Promise.reject(err);
      });

    // Enable animations on elements
    let AnimationsEnabled = AnimationsConfig.then(function (loAnimations) {
      return Promise.resolve(loAnimations).then(function (lo) {
        return new Promise(function (resolve, reject) {

          $.each(lo, function (i, o) {
            // Assign Waypoint animation handler
            wShow(o);
          });

          return resolve();

        });
      });

    })
    .catch(function (e) {
      console.warn('Failed to Enable Animations: [', e, ']');
      return Promise.resolve();
    });

    AnimationsEnabled.then(function () {
      console.info('ANIMATIONS ENABLED');
    });

  })();

  // ---------------------------------------------------------------------------
  //  NOTY options
  // ---------------------------------------------------------------------------

  (function () {
    $.noty.defaults = {
      layout:         'topRight'
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
          , close:  'animated flipOutY' // or Animate.css class names like: 'animated bounceOutLeft'
          , easing: 'swing'
          , speed:  500                 // opening & closing animation speed
        }
      , closeWith:    ['click']           // ['click', 'button', 'hover', 'backdrop']     // backdrop click will close all notifications
      , modal:        false               // [boolean] if true adds an overlay
      , killer:       false               // [boolean] if true closes all notifications and shows itself
      , callback: {
          onShow:         function () {}
          , afterShow:    function () {}
          , onClose:      function () {}
          , afterClose:   function () {}
          , onCloseClick: function () {}
        }
    };
  }());

  // ---------------------------------------------------------------------------
  //  Transformations
  // ---------------------------------------------------------------------------

  (function () {

    $(window).on('load', function () {
      console.log('SETTING UP CONTACTS');
      $('[name="contact-cell"]').html(atob('{{person.contacts.cell}}'));
      $('[name="contact-email"]').prop('href', atob('{{person.contacts.email}}'));
    });

  })();

  // ---------------------------------------------------------------------------
  //  Notifications
  // ---------------------------------------------------------------------------

  (function () {
    $(window).on('load', function () {
      // console.log('SETTING TIMEOUTS FOR UX NOTIFICATIONS');
      //       setTimeout(function () {
      //         console.log('SHOWING WELCOME NOTIFICATION');
      //         window.noty({
      //           layout: 'topLeft'
      //           , text: `
      // <div class="noty-container noty_body">
      //   <span class="h3">Welcome!</span>
      // <div>
      // `
      //           , timeout: 5000
      //           , type:    'information'
      //         });
      //       }, 4000);

      //       setTimeout(function () {
      //         console.log('SHOWING BUILD DATE NOTIFICATION');
      //         window.noty({
      //           layout: 'bottomRight'
      //           , text: `
      // <div class="noty-container noty_body">
      // <p>
      // <i class="fa fa-calendar fa-fw fa-2x"></i>
      // Content was last updated at <br />
      // <strong class="text-success">{{built.date}}</strong>
      // </p>
      // <div>
      // `
      //           , timeout: 8000
      //           , type:    'success'
      //         });
      //       }, 10000);

      // for {{person.name.full}} <br />

    });
  })();

  /* ------------------------------------------------------------------------ /*
   *  LOAD Indicators
  /* ------------------------------------------------------------------------ */

  $(window).ready(function () {
    console.log('WINDOW___READY');
  });

  $(document).ready(function () {
    console.log('DOCUMENT___READY');
  });

  $(window).on('load', function () {
    console.log('WINDOW___LOAD');
  });

});
