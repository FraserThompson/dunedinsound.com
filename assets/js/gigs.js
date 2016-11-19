var gigsInit = function() {

    window.addEventListener("scroll", function() {

        var dates = document.getElementById("sorting-nav")

        if ((document.documentElement.scrollTop || document.body.scrollTop) > (window.innerHeight * 0.9)){
            dates.classList.add('visible');
        } else {
            dates.classList.remove('visible');
        }

    });

}
