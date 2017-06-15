var isotopeConfig = isotopeConfig || {};

isotopeConfig.isotopeInit = function() {

  isotopeConfig.qsRegex;

  isotopeConfig.filterFunction = function (elem) {
    var string = "";
    var name = elem.querySelector('.name');
    var artistNames = elem.querySelector('.artistNames');
    var venueName = elem.querySelector('.venueName');

    if (name) {
      string += name.innerHTML + ", ";
    }

    if (artistNames) {
      string += artistNames.innerHTML + ", ";
    }

    if (venueName) {
      string += venueName.innerHTML;
    }

    return isotopeConfig.qsRegex && string ? string.match( isotopeConfig.qsRegex ) : true;
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