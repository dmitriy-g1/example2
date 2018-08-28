;(function() {
//
function scrollWidget (list, added_class, denominator) {
  //
  var ITEMS_LIST = list;
      ADDED_CLASS = added_class;
  //
  var TOP_COORDS = [],
      BOTTOM_COORDS = [],
      TOP_COORDS_LINKS = {},
      BOTTOM_COORDS_LINKS = {};
  //
  var TOP_MARGIN = Math.floor( (window.innerHeight/denominator) ),
      BOTTOM_MARGIN = Math.floor( (window.innerHeight/denominator)*(denominator-1) ),
      DOCUMENT_HEIGHT = getDocumentHeight();
  //
  var top_cur = 0,
      bottom_cur = 0;
  //  
  //
  prepare ()
  //
  var resize_timer = null;
  window.onresize = function () {
    clearTimeout(resize_timer);
    resize_timer = setTimeout(function () {
      prepare();
    }, 100);
  }
  //
  //
  // --------------------PREPARE
  function prepare () {
    //
    TOP_COORDS = [],
    BOTTOM_COORDS = [],
    TOP_COORDS_LINKS = {},
    BOTTOM_COORDS_LINKS = {};
    //
    TOP_MARGIN = Math.floor( (window.innerHeight/denominator) ),
    BOTTOM_MARGIN = Math.floor( (window.innerHeight/denominator)*(denominator-1) ),
    DOCUMENT_HEIGHT = getDocumentHeight();
    //
    top_cur = 0,
    bottom_cur = 0;
    //
    // fill coords and block
    for (var i = 0; i < ITEMS_LIST.length; i++) {
      //
      var x = Math.floor( getCoords(ITEMS_LIST[i]).top );
      var y = Math.floor( getCoords(ITEMS_LIST[i]).bottom );
      //      
      if ( TOP_COORDS_LINKS[x] === undefined ) {
        TOP_COORDS_LINKS[x] = [];
        TOP_COORDS_LINKS[x].push(ITEMS_LIST[i]);
        TOP_COORDS.push(x);
      } else {
        TOP_COORDS_LINKS[x].push(ITEMS_LIST[i]);
      }
      //
      if ( BOTTOM_COORDS_LINKS[y] === undefined ) {
        BOTTOM_COORDS_LINKS[y] = [];
        BOTTOM_COORDS_LINKS[y].push(ITEMS_LIST[i]);
        BOTTOM_COORDS.push(y);
      } else {
        BOTTOM_COORDS_LINKS[y].push(ITEMS_LIST[i]);
      }
    }
    //
    TOP_COORDS.sort(function(a, b) {
      return a - b;
    });
    BOTTOM_COORDS.sort(function(a, b) {
      return a - b;
    });
    //
    //  check if some items higher or lower margins
    while ( BOTTOM_COORDS[0] < TOP_MARGIN ) {
      for (var i = 0; i < BOTTOM_COORDS_LINKS[BOTTOM_COORDS[0]].length; i++) {
        BOTTOM_COORDS_LINKS[BOTTOM_COORDS[1]].push(BOTTOM_COORDS_LINKS[BOTTOM_COORDS[0]][i])
      }
      BOTTOM_COORDS.shift();
    }
    //
    while ( TOP_COORDS[TOP_COORDS.length-1] > (DOCUMENT_HEIGHT-TOP_MARGIN) ) {
      for ( var i = 0; i < TOP_COORDS_LINKS[TOP_COORDS[TOP_COORDS.length-1]].length; i++ ) {
        TOP_COORDS_LINKS[TOP_COORDS[TOP_COORDS.length-2]].push(TOP_COORDS_LINKS[TOP_COORDS[TOP_COORDS.length-1]][i]);
      }
      TOP_COORDS.pop();
    }
    //
    //  show current items
    for ( var i=0; i < ITEMS_LIST.length; i++ ) {
      ITEMS_LIST[i].classList.remove(ADDED_CLASS);
    }
    //
    for ( var i=0; i<TOP_COORDS.length; i++ ) {
      if ( ( window.pageYOffset + BOTTOM_MARGIN ) > TOP_COORDS[top_cur] ) {
        for ( var i=0; i < TOP_COORDS_LINKS[TOP_COORDS[top_cur]].length; i++ ) {
          TOP_COORDS_LINKS[TOP_COORDS[top_cur]][i].classList.add(ADDED_CLASS);
        }
        top_cur += 1;
      }
    }
    for ( var i=0; i<BOTTOM_COORDS.length; i++ ) {
      if ( ( window.pageYOffset + TOP_MARGIN ) > BOTTOM_COORDS[bottom_cur] ) {
        for ( var i=0; i < BOTTOM_COORDS_LINKS[ BOTTOM_COORDS[bottom_cur] ].length; i++ ) {
          BOTTOM_COORDS_LINKS[ BOTTOM_COORDS[bottom_cur] ][i].classList.remove(ADDED_CLASS);
        }
        bottom_cur += 1;
      }
    }
    //-----------------------------------end prepare
  }
  //
  //
  // --------------------SCROLL CONTROL
  var last_scroll = window.pageYOffset;
  window.addEventListener("scroll", scrollControl);
  function scrollControl() {
    //
    var scroll = window.pageYOffset;
    //
    if ( scroll > last_scroll ) {  /*down*/
      //
      if ( (scroll + BOTTOM_MARGIN) > TOP_COORDS[top_cur] ) {
        for ( var i=0; i < TOP_COORDS_LINKS[TOP_COORDS[top_cur]].length; i++ ) {
          TOP_COORDS_LINKS[TOP_COORDS[top_cur]][i].classList.add(ADDED_CLASS);
        }
        top_cur += 1;
      }
      //
      if ( (scroll + TOP_MARGIN) > BOTTOM_COORDS[bottom_cur] ) {
        for ( var i=0; i < BOTTOM_COORDS_LINKS[BOTTOM_COORDS[bottom_cur]].length; i++ ) {
          BOTTOM_COORDS_LINKS[BOTTOM_COORDS[bottom_cur]][i].classList.remove(ADDED_CLASS);
        }
        bottom_cur += 1;
      }
      //
    } else if ( scroll < last_scroll ) {  /*up*/
      //
      if ( (scroll+BOTTOM_MARGIN) < TOP_COORDS[top_cur-1] ) {
        for ( var i=0; i < TOP_COORDS_LINKS[TOP_COORDS[top_cur-1]].length; i++ ) {
          TOP_COORDS_LINKS[TOP_COORDS[top_cur-1]][i].classList.remove(ADDED_CLASS);
        }
        top_cur = ( (top_cur-1)<0 ) ? 0 : top_cur - 1;
      }
      //
      if ( (window.pageYOffset+TOP_MARGIN) < BOTTOM_COORDS[bottom_cur] ) {
        for ( var i=0; i < BOTTOM_COORDS_LINKS[BOTTOM_COORDS[bottom_cur]].length; i++ ) {
          BOTTOM_COORDS_LINKS[BOTTOM_COORDS[bottom_cur]][i].classList.add(ADDED_CLASS);
        }
        bottom_cur = ( (bottom_cur-1)<0 ) ? 0 : bottom_cur - 1;
      }
      //
    }
    //
    last_scroll = scroll;
  //   --------------------------------------------------------------end onscroll  
}
  //
  //
  // --------------------CHECK ON STOP
  var checked = true;
  var checking_last_scroll = window.pageYOffset;
  var timer = setTimeout(function check() {
    //
    var scroll = window.pageYOffset;
    //
    if ( scroll != checking_last_scroll ) {
      //
      checked = false;
    } else {
      //
      if ( !checked ) {
        checkOnStop();
        checked = true;
      }
    }
    //
    checking_last_scroll = scroll;
    timer = setTimeout(check, 100);
  }, 500);
  //
  //
  function checkOnStop () {
    //
    var alt_top_cur = 0;
    var alt_bottom_cur = 0;
    //
    for ( var i=0; i<TOP_COORDS.length; i++ ) {
      if ( ( window.pageYOffset + BOTTOM_MARGIN ) > TOP_COORDS[alt_top_cur] ) {
        alt_top_cur += 1;
      }
    }
    for ( var i=0; i<BOTTOM_COORDS.length; i++ ) {
      if ( ( window.pageYOffset + TOP_MARGIN ) > BOTTOM_COORDS[alt_bottom_cur] ) {
        alt_bottom_cur += 1;
      }
    }
    //
    if ( alt_top_cur != top_cur || alt_bottom_cur != bottom_cur ) {
      //
      console.log("check fail");
      //
      top_cur = 0,
      bottom_cur = 0;
      //
      for ( var i=0; i < ITEMS_LIST.length; i++ ) {
        ITEMS_LIST[i].classList.remove(ADDED_CLASS);
      }
      //
      for ( var i=0; i<TOP_COORDS.length; i++ ) {
        if ( ( window.pageYOffset + BOTTOM_MARGIN ) > TOP_COORDS[top_cur] ) {
          for ( var i=0; i < TOP_COORDS_LINKS[TOP_COORDS[top_cur]].length; i++ ) {
            TOP_COORDS_LINKS[TOP_COORDS[top_cur]][i].classList.add(ADDED_CLASS);
          }
          top_cur += 1;
        }
      }
      for ( var i=0; i<BOTTOM_COORDS.length; i++ ) {
        if ( ( window.pageYOffset + TOP_MARGIN ) > BOTTOM_COORDS[bottom_cur] ) {
          for ( var i=0; i < BOTTOM_COORDS_LINKS[ BOTTOM_COORDS[bottom_cur] ].length; i++ ) {
            BOTTOM_COORDS_LINKS[ BOTTOM_COORDS[bottom_cur] ][i].classList.remove(ADDED_CLASS);
          }
          bottom_cur += 1;
        }
      }
    }
  //   -------------------------------------------end checkOnStop
  }
  //
  //
  // --------------------ADDITIONAL
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
  //-------------------------------------------end scrollWidget
}
//
window.scrollWidget = scrollWidget;
//
}());