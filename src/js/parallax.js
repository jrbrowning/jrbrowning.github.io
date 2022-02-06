function castParallax() {
    window.addEventListener("scroll", function (event) {
        

        var top = this.pageYOffset;
        // console.log('current scroll value is', top);
        var layers = document.getElementsByClassName("parallax-top");
        var layer, speed;
        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            speed = layer.getAttribute('data-depth');
            var yPos = -(top * speed / 100);
            // console.log('changed layer: ',layer, 'value moved was: ',yPos);
            layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
        }
    });

    window.addEventListener("scroll", function (event) {

        var top = this.pageYOffset;
        var layers = document.getElementsByClassName("parallax-btm");
        var layer, speed;
        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            speed = layer.getAttribute('data-depth');
            var yPos = -(top * speed / 100) - 330;
            // 330px is hard coded size from scss
            // console.log('changed layer: ',layer, 'value moved was: ',yPos);
            layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
        }
    });
}

function startSite() {
        castParallax();
}

document.body.onload = startSite();

// Source code parallax references:
// http://www.firewatchgame.com
// https://medium.com/@PatrykZabielski/how-to-make-multi-layered-parallax-illustration-with-css-javascript-2b56883c3f27
