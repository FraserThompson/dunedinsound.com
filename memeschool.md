---
title: Memeschool
permalink: "/memeschool/"
position: 0
layout: default
exclude: true
---

<div class="cover-all"></div>

<iframe id="memeschool" style="border: 0; position:absolute; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh; z-index: 9000;" src="https://www.youtube.com/embed/fJdA7dwx6-4?rel=0&amp;controls=0&amp;showinfo=0&autoplay=1" frameborder="0" allowfullscreen ></iframe>

<style>

    #memeschool {
        -webkit-transition: all 3s ease;
        -moz-transition: all 3s ease;
        -o-transition: all 3s ease;
        -ms-transition: all 3s ease;
        transition: all 3s ease;
    }
</style>

<script>
    var memeschool = document.getElementById('memeschool');
    setTimeout(function() {
        memeschool.style.height = "0vh";
    }, 1000);
</script>