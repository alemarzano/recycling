var $comparisonSlider = $('.comparison-slider-container'),
    $sliderLeft = $comparisonSlider.find('.slider-left'),
    $sliderRight = $comparisonSlider.find('.slider-right'),
    $handle = $comparisonSlider.find('.handle'),
    $caption = $comparisonSlider.find('.slider-caption'),
    $captionLeft = $comparisonSlider.find('.slider-caption-left'),
    $captionRight = $comparisonSlider.find('.slider-caption-right'),

    $comparisonSliderWidth = $comparisonSlider.width(),
    $comparisonSliderHeight = $comparisonSlider.height(),

    $startPosition = ($comparisonSliderWidth/100)*50,

    $btnExpandLeft = $('.btn-expand-left'),
    $btnExpandCenter = $('.btn-expand-center'),
    $btnExpandRight = $('.btn-expand-right'),

    tl = new TimelineMax({delay:1});

// set initial positioning

// tween 
tl.set($caption, {autoAlpha:0, yPercent:-100}, 0);
tl.to($sliderLeft, 0.7, {width:$startPosition, ease:Back.easeOut.config(1.7)}, 0);
// tl.to($sliderRight, 0.7, {width:$startPosition, ease:Back.easeOut.config(1.7)}, 0);
tl.to($handle, 0.7, {x:$startPosition, ease:Back.easeOut.config(1.7)}, 0);
tl.staggerTo($caption, 0.7, {autoAlpha:0, yPercent:0, ease:Back.easeInOut.config(3)}, -0.3, 0);

// draggable
Draggable.create($handle, {
  bounds: {
    minX:0, 
    minY:0, 
    maxX:$comparisonSliderWidth, 
    maxY:$comparisonSliderHeight
  },
  type:'x',
  edgeResistance:1,
  throwProps:true,
  onDrag: onHandleDrag,
  onLockAxis: function() {
    var functionName = arguments.callee.name;
    console.log(functionName);
  }
});

function changeRight() {
  var leftWidth = parseInt($('.slider-left').width());

  ($sliderRight).css({
    width: $comparisonSliderWidth - leftWidth
  });
}
function onHandleDrag() {
  // console.log('drag', this)
  tSet = TweenMax.set($sliderLeft, {width:this.endX}, 0);
  console.log(tSet.vars["css"].width);
  changeRight();

 

  // show/hide caption if you drag past the center of the container, towards left/right direction.
  if (this.endX >= ((this.maxX/2)+10) && this.getDirection() === 'right') {
    showLeftCaption();
  }
  else if (this.endX <= ((this.maxX/2)-10) && this.getDirection() === 'left') {
    showRightCaption();
  }
  else {
    hideBothCaptions();
  }
}

function showLeftCaption() {
  TweenMax.to($captionLeft, 0.3, {autoAlpha:1, yPercent:0}, 0);
  TweenMax.to($captionRight, 0.3, {autoAlpha:0, yPercent:-100}, 0);
  
}

function showRightCaption() {
  TweenMax.to($captionLeft, 0.3, {autoAlpha:0, yPercent:-100}, 0);
  TweenMax.to($captionRight, 0.3, {autoAlpha:1, yPercent:0}, 0);
}

function hideBothCaptions() {
  TweenMax.to($captionLeft, 0.3, {autoAlpha:0, yPercent:0}, 0);
  TweenMax.to($captionRight, 0.3, {autoAlpha:0, yPercent:0}, 0);
}

function slideHandleTo(_pos){
TweenMax.to($sliderLeft, 0.7, {width:($comparisonSliderWidth/100)*_pos, ease:Power2.easeOut}, 0);
TweenMax.to($sliderRight, 0.7, {
   width: ($comparisonSliderWidth / 100) * _pos,
   ease: Power2.easeOut
 }, 0);
  TweenMax.to($handle, 0.7, {x:($comparisonSliderWidth/100)*_pos, ease:Power2.easeOut}, 0);

}

// CLICK HANDLERS


$btnExpandLeft.on('click', function(){
  slideHandleTo(100);
  showLeftCaption();
  
})

$btnExpandCenter.on('click', function(){
  slideHandleTo(50);
  hideBothCaptions();
})

$btnExpandRight.on('click', function(){
  slideHandleTo(0);
  showRightCaption();
})

/* ACCORDION */

const $uiAccordion = $('.js-ui-accordion');

$uiAccordion.accordion({
  collapsible: true,
  heightStyle: 'content',

  activate: (event, ui) => {
    const newHeaderId = ui.newHeader.attr('id');

    if (newHeaderId) {
      history.pushState(null, null, `#${newHeaderId}`);
    }
  },

  create: (event, ui) => {
    const $this = $(event.target);
    const $activeAccordion = $(window.location.hash);

    if ($this.find($activeAccordion).length) {
      $this.accordion('option', 'active', $this.find($this.accordion('option', 'header')).index($activeAccordion));
    }
  } });


$(window).on('hashchange', event => {
  const $activeAccordion = $(window.location.hash);
  const $parentAccordion = $activeAccordion.parents('.js-ui-accordion');

  if ($activeAccordion.length) {
    $parentAccordion.accordion('option', 'active', $parentAccordion.find($uiAccordion.accordion('option', 'header')).index($activeAccordion));
  }
});