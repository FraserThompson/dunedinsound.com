var isotopeConfig = isotopeConfig || {};

isotopeConfig.isotopeInit = function() {

  isotopeConfig.qsRegex;

  isotopeConfig.filterFunction = function (elem) {
    if (elem.querySelector('.name')) {
      return isotopeConfig.qsRegex ? elem.querySelector('.name').innerHTML.match( isotopeConfig.qsRegex ) : true;
    } else {
      return true;
    }
  }

  isotopeConfig.debounce = function( fn, threshold ) {
    var timeout;
    return function debounced() {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      function delayed() {
        fn();
        timeout = null;
      }
      setTimeout( delayed, threshold || 100 );
    };
  }

}