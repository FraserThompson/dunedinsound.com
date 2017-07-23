var blazy = new Blazy({
	offset: 250,
  selector: '.b-lazy',
  success: function(element){
    setTimeout(function(){
      var parent = element.parentNode;
      parent.className = parent.className.replace(/\bloading\b/,'');
    }, 200);
  }, error: function(element, msg){
      if(msg === 'missing'){
          var parent = element.parentNode;
          parent.className = parent.className.replace(/\bloading\b/,'failed');
      }
      else if(msg === 'invalid'){
          var parent = element.parentNode;
          parent.className = parent.className.replace(/\bloading\b/,'failed');
      }  
  }
});

blazy.revalidate();