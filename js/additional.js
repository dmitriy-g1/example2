
function ParallaxItem(item) {
  //
  var ITEM = item,
      BACKGROUND = ITEM.querySelector(".background");
  //
  //
  var shift,
      control_length_top,
      control_length_bottom,
      control_length;
  //
  prepare();
  //
  //
  window.addEventListener("scroll", function () {
    //
    var scroll = window.pageYOffset;
    //
    if ( scroll > control_length_top && scroll < control_length_bottom ) {
      //
      var new_top = ((scroll - control_length_top) / control_length) * shift;
      //
      BACKGROUND.style.top = "-" + new_top + "px"
    }
  });
  window.addEventListener("resize", function () {
    prepare();
  });
  //
  //
  function prepare () {
    //
    shift = BACKGROUND.clientHeight - ITEM.clientHeight;
    //
    control_length_top = getCoords(ITEM).top - window.innerHeight;
    if ( control_length_top < 0 ) {
      control_length_top = 0;
    }
    //
    control_length_bottom = getCoords(ITEM).bottom;
    if ( (getDocumentHeight() - control_length_bottom) < window.innerHeight ) {
      control_length_bottom = getDocumentHeight() - window.innerHeight;
    }
    //
    control_length = control_length_bottom - control_length_top;
  }
}

//
//
function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.bottom + pageYOffset
  };
}
function getDocumentHeight () {
  var val = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  return val;
}



