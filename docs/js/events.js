"use strict";

var $comparisonSlider = $(".comparison-slider-container"),
    $sliderLeft = $comparisonSlider.find(".slider-left"),
    $sliderRight = $comparisonSlider.find(".slider-right"),
    $handle = $comparisonSlider.find(".handle"),
    $caption = $comparisonSlider.find(".slider-caption"),
    $captionLeft = $comparisonSlider.find(".slider-caption-left"),
    $captionRight = $comparisonSlider.find(".slider-caption-right"),
    $comparisonSliderWidth = $comparisonSlider.width(),
    $comparisonSliderHeight = $comparisonSlider.height(),
    $startPosition = $comparisonSliderWidth / 100 * 50,
    $btnExpandLeft = $(".btn-expand-left"),
    $btnExpandCenter = $(".btn-expand-center"),
    $btnExpandRight = $(".btn-expand-right"),
    tl = new TimelineMax({
  delay: .5
}); // set initial positioning
// tween

tl.set($caption, {
  autoAlpha: 0,
  yPercent: -100
}, 0);
tl.to($sliderLeft, 0.7, {
  width: $startPosition,
  ease: Back.easeOut.config(1.7)
}, 0); // tl.to($sliderRight, 0.7, {width:$startPosition, ease:Back.easeOut.config(1.7)}, 0);

tl.to($handle, 0.7, {
  x: $startPosition,
  ease: Back.easeOut.config(1.7)
}, 0);
tl.staggerTo($caption, 0.7, {
  autoAlpha: 0,
  yPercent: 0,
  ease: Back.easeInOut.config(3)
}, -0.3, 0); // draggable

Draggable.create($handle, {
  bounds: {
    minX: 0,
    minY: 0,
    maxX: $comparisonSliderWidth,
    maxY: $comparisonSliderHeight
  },
  type: "x",
  edgeResistance: 1,
  throwProps: true,
  onDrag: onHandleDrag,
  onLockAxis: function onLockAxis() {
    var functionName = arguments.callee.name;
    console.log(functionName);
  }
});

function onHandleDrag() {
  var tSet = TweenMax.set($sliderLeft, {
    width: this.endX
  }, 0);
  var leftWidth = tSet.vars['css'].width;
  $sliderRight.css({
    width: $comparisonSliderWidth - leftWidth
  }); // show/hide caption if you drag past the center of the container, towards left/right direction.

  if (this.endX >= this.maxX / 2 + 10 && this.getDirection() === "right") {
    showLeftCaption();
  } else if (this.endX <= this.maxX / 2 - 10 && this.getDirection() === "left") {
    showRightCaption();
  } else {
    hideBothCaptions();
  }
}

function showLeftCaption() {
  TweenMax.to($captionLeft, 0.3, {
    autoAlpha: 1,
    yPercent: 0
  }, 0);
  TweenMax.to($captionRight, 0.3, {
    autoAlpha: 0,
    yPercent: -100
  }, 0);
}

function showRightCaption() {
  TweenMax.to($captionLeft, 0.3, {
    autoAlpha: 0,
    yPercent: -100
  }, 0);
  TweenMax.to($captionRight, 0.3, {
    autoAlpha: 1,
    yPercent: 0
  }, 0);
}

function hideBothCaptions() {
  TweenMax.to($captionLeft, 0.3, {
    autoAlpha: 0,
    yPercent: 0
  }, 0);
  TweenMax.to($captionRight, 0.3, {
    autoAlpha: 0,
    yPercent: 0
  }, 0);
}

function slideHandleTo(_pos) {
  TweenMax.to($sliderLeft, 0.7, {
    width: $comparisonSliderWidth / 100 * _pos,
    ease: Power2.easeOut
  }, 0);
  TweenMax.to($handle, 0.7, {
    x: $comparisonSliderWidth / 100 * _pos,
    ease: Power2.easeOut
  }, 0);
} // CLICK HANDLERS


$btnExpandLeft.on("click", function () {
  slideHandleTo(100);
  showLeftCaption();
  $sliderRight.css('width', $comparisonSliderWidth - $sliderLeft.width() * 2);
  console.log($sliderRight.width());
});
$btnExpandCenter.on("click", function () {
  slideHandleTo(50);
  hideBothCaptions();

  if ($sliderLeft.width() == 0) {
    $sliderRight.css('width', $comparisonSliderWidth);
  } else {
    $sliderRight.css('width', $sliderLeft.width() * 2);
  }
});
$btnExpandRight.on("click", function () {
  slideHandleTo(0);
  showRightCaption();
  $sliderRight.css('width', $comparisonSliderWidth);
});
/* ACCORDION */

var $uiAccordion = $(".js-ui-accordion");
$uiAccordion.accordion({
  collapsible: true,
  heightStyle: "content",
  activate: function activate(event, ui) {
    var newHeaderId = ui.newHeader.attr("id");

    if (newHeaderId) {
      history.pushState(null, null, "#".concat(newHeaderId));
    }
  },
  create: function create(event, ui) {
    var $this = $(event.target);
    var $activeAccordion = $(window.location.hash);

    if ($this.find($activeAccordion).length) {
      $this.accordion("option", "active", $this.find($this.accordion("option", "header")).index($activeAccordion));
    }
  }
});

$(window).on("hashchange", function (event) {
  var $activeAccordion = $(window.location.hash);
  var $parentAccordion = $activeAccordion.parents(".js-ui-accordion");

  if ($activeAccordion.length) {
    $parentAccordion.accordion("option", "active", $parentAccordion.find($uiAccordion.accordion("option", "header")).index($activeAccordion));
  }
});


/* HUERTA*/

document.querySelector('.more').addEventListener('click', function () {
  document.querySelector('.more').classList.toggle('expand');
  $('.slider-caption-right .info .txt ').css('display', 'inline-block');
  $(".txt").animate({
    scrollTop: $('.more.expand').height() + 460
  }, "slow"); // var scrollBottom = $(window).scrollTop() + $(window).height();

  return false;
}); // $(".more").click(function () {
//   var el = $(this);
//   window.setTimeout(function() {
//       el.toggleClass('expand');}, 4000);
// });

/* function playVideo(el) {
  var videoId = el.data('video');
  var video = document.getElementById(videoId);

  if (video.paused) {
    // Play the video
    video.play();
    el.removeClass('paused').addClass('playing');
    $('.video-control').css('opacity', '0');
  } else {
    // Pause the video
    video.pause();
    el.removeClass('playing').addClass('paused');
    $('.video-control').css('opacity', '1');
  }
}

$('.player').on('click', '.js-video-control', function (e) {
  playVideo($(this));
  e.preventDefault();
});
var video1 = document.getElementById('video1');

function videoPausePlayHandler(e) {
  if (e.type == 'playing') {
    video1.setAttribute("controls", "controls");
  } else if (e.type == 'pause') {
    video1.removeAttribute("controls");
  }
}

video1.addEventListener('playing', videoPausePlayHandler, false);
video1.addEventListener('pause', videoPausePlayHandler, false);

/* CONTROLS IE */

function isIE() {
  var ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  
  return is_ie; 
}
/* 
if (isIE()){
  video1.setAttribute("controls", "controls");
  $('.player').on('click', 'video', function (e) {
    playVideo($(this));
    e.preventDefault();
    if (e.type == 'playing') {
      video1.setAttribute("controls", "controls");
    } else if (e.type == 'pause') {
      video1.removeAttribute("controls");
    }
  });
  
}
*/
/* NEW FUNCION FOR VIDEO */
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

var player;

function onYouTubeIframeAPIReady() {
  // $('.video-control').click(function () {
  //   $('.poster-image').hide();
  //   $(this).hide();
    player = new YT.Player('player', {
      videoId: 'TBB90libIlM',
      events: {
        'onReady': onPlayerReady
      },
      playerVars: {
        'autoplay': 1,
        'controls': 1,
        'rel': 0
      }
    });
  };
 // 4. The API will call this function when the video player is ready.


function onPlayerReady(event) {
  event.target.playVideo();
} // 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.


var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
} 

