var button = document.getElementById("menu-toggle");

button.addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("wrapper").classList.toggle("toggled");
    document.getElementById("menu-toggle").classList.toggle("toggled");
});