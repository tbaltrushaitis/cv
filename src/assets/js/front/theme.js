/*!
 * Project:     cv
 * File:        ./assets/js/front/theme.js
 * Copyright(c) 2016-present Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */
/* jshint unused:false */
/*!
 * Theme Name:  IAMX
 * Author:      Trendy Theme
 * Author URL:  http://trendytheme.net
 */
/*!
  =   Preloader
  =   Animated scrolling / Scroll Up
  =   Full Screen Slider
  =   Sticky Menu
  =   Back To Top
  =   Countup
  =   Progress Bar
  =   More skill
  =   Shuffle
  =   Magnific Popup
  =   Google Map
 */

window.jQuery(function ($) {

  'use strict';

  // ---------------------------------------------------------------------------
  // Preloader
  // ---------------------------------------------------------------------------

  (function () {
    $(document).ready(function () {
      // $(window).on('load', function () {
      $('#pre-status').fadeOut();
      $('#tt-preloader').delay(150).fadeOut('slow');
      console.log('PRELOADER__REMOVED');
    });
  }());

  // ---------------------------------------------------------------------------
  //  Animated scrolling / Scroll Up
  // ---------------------------------------------------------------------------

  (function () {
    $('a[href*="#"]').bind('click', function (e) {
      var anchor = $(this);
      $('html, body').stop().animate({
        scrollTop:  $(anchor.attr('href')).offset().top
      }, 1000);
      e.preventDefault();
    });
  }());

  // ---------------------------------------------------------------------------
  //  Full Screen Slider
  // ---------------------------------------------------------------------------

  (function () {
    $('.tt-fullHeight').height($(window).height());

    $(window).resize(function () {
      $('.tt-fullHeight').height($(window).height());
    });
  }());

  // ---------------------------------------------------------------------------
  //  Sticky Menu
  // ---------------------------------------------------------------------------

  (function () {

    $('.header').sticky({
      topSpacing: 0
    });

    $('body').scrollspy({
      target: '#navbar-custom'
      , offset: 70
    });

  }());

  // ---------------------------------------------------------------------------
  //  Back To Top
  // ---------------------------------------------------------------------------

  (function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('.scroll-up').fadeIn();
      } else {
        $('.scroll-up').fadeOut();
      }
    });
  }());

  // ---------------------------------------------------------------------------
  //  Countup
  // ---------------------------------------------------------------------------

  $('.count-wrap').bind('inview', function (event, visible, visiblePartX, visiblePartY) {
    $(this).find('.timer').each(function () {
      var $this = $(this);
      if (visible) {
        $({Counter: 0}).animate({Counter: $this.data('original-text')}, {
          duration: 2000
          , easing: 'swing'
          , step: function () {
              $this.text(Math.ceil(this.Counter));
            }
        });
      } else {
        $({Counter: 0});
        $this.text(Math.ceil($this.data('original-text')));
      }
    });
  });

  // ---------------------------------------------------------------------------
  //  Progress Bar
  // ---------------------------------------------------------------------------

  $('.skill-progress').bind('inview', function (event, visible, visiblePartX, visiblePartY) {
    if (visible) {
      $.each($('div.progress-bar'), function () {
        $(this).css('width', null)
          .css('width', $(this).attr('aria-valuenow') + '%');
      });
    }
  });

  // ---------------------------------------------------------------------------
  //  More skill
  // ---------------------------------------------------------------------------

  $('.more-skill').bind('inview', function (event, visible, visiblePartX, visiblePartY) {
    if (visible) {
      // configuration goes here
      $('.chart').easyPieChart({
        easing:       'easeOut'
        , barColor:   '#68c3a3'
        , delay:      1500
        , lineWidth:  8
        , rotate:     0
        , scaleColor: false
        , size:       140
        , trackColor: '#3a4149'
        , animate: {
            duration: 2500
            , enabled:  true
          }
        , onStep: function (from, to, percent) {
            this.el.children[0].innerHTML = Math.round(percent, 1);
          }
      });
    }
  });

  // ---------------------------------------------------------------------------
  //  Portfolio
  // ---------------------------------------------------------------------------

  (function () {

    var $grid = $('#og-grid');

    var shuffleInstance = new window.Shuffle($grid, {
      itemSelector: '.portfolio-item'
    });

    /* reshuffle when user clicks a filter item */
    $('#filter a').click(function (e) {
      e.preventDefault();

      //  set active class
      $('#filter a').removeClass('active');
      $(this).addClass('active');

      //  get group name from clicked item
      var groupName = $(this).attr('data-group');

      //  reshuffle grid
      shuffleInstance.filter(groupName);
    });

  }());

  // ---------------------------------------------------------------------------
  //  Magnific Popup
  // ---------------------------------------------------------------------------

  (function () {
    $('.image-link').magnificPopup({
      gallery: {
        enabled: true
      }
      , removalDelay: 300             // Delay in milliseconds before popup is removed
      , mainClass:    'mfp-with-zoom' // this class is for CSS animation below
      , type:         'image'
    });
  }());

  // ---------------------------------------------------------------------------
  //  WOW JS
  // ---------------------------------------------------------------------------

  (function () {

    new window.WOW({
      boxClass:          'wow'       //  animated element css class (default is wow)
      , animateClass:    'animate__animated'  //  animation css class (default is animated)
      , offset:          0           //  distance to the element when triggering the animation (default is 0)
      , mobile:          true        //  trigger animations on mobile devices (default is true)
      , live:            true        //  act on asynchronously loaded content (default is true)
      , scrollContainer: null        //  optional scroll container selector, otherwise use window,
      , resetAnimation:  false        //  reset animation on end (default is true)
      , callback: function (box) {
          //  the callback is fired every time an animation is started
          //  the argument that is passed in is the DOM node being animated
          // console.log(`[WOW] animating box [${box.tagName.toLowerCase()}]: [${box.className}]`, box);
        }
    }).init();

  }());

  // ---------------------------------------------------------------------------
  //  Contact Form
  // ---------------------------------------------------------------------------

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    console.log('contactForm SUBMIT Action');

    var $action = $(this).prop('action');
    var $data   = $(this).serialize();
    var $this   = $(this);

    $this.prevAll('.alert').remove();

    $.post($action, $data, function (data) {

      if ('error' === data.response) {
        $this.before('<div class="alert alert-danger">' + data.message + '</div>');
      }

      if ('success' === data.response) {
        $this.before('<div class="alert alert-success">' + data.message + '</div>');
        $this.find('input, textarea').val('');
      }

    }, 'json');

  });

  // ---------------------------------------------------------------------------
  //  Google Map
  // ---------------------------------------------------------------------------

  (function () {

    let myLatlng, myLat, myLng, styles, mapOptions, map, marker, contentString, infoWindow;

    myLat = parseFloat('{{person.bio.location.lat}}');
    myLng = parseFloat('{{person.bio.location.lng}}');
    myLatlng = new window.google.maps.LatLng(myLat, myLng);

    styles = [
      {
        featureType: 'landscape'
        , stylers: [
            {color: '#f7f7f7'}
          ]
      }
      , {
        featureType: 'road'
        , stylers: [
            {hue: '#fff'}
            , {saturation: -70}
          ]
      }
      , {
        featureType: 'poi'   // points of interest
        , stylers: [
            {hue: ''}
          ]
      }
    ];

    mapOptions = {
      zoom:               10
      , scrollwheel:      false
      , center:           myLatlng
      , mapTypeId:        window.google.maps.MapTypeId.ROADMAP
      , disableDefaultUI: true
      , styles:           styles
    };

    map = new window.google.maps.Map(document.getElementById('mapCanvas'), mapOptions);

    marker = new window.google.maps.Marker({
      position:    myLatlng
      , map:       map
      , animation: window.google.maps.Animation.DROP
      , title:     'I@{{person.bio.location.city}}'
    });

    contentString = `Hello, Visitor!`;
    infoWindow = new window.google.maps.InfoWindow({
      content: contentString
    });

    window.google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(map, marker);
    });

  }());

});
