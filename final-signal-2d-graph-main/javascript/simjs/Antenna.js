/*
 * The Antenna class represents a single antenna within the antenna array.
 */

(function(exports) {

	function Antenna(amplitude) {
	  this.amplitude = amplitude;
	}

	exports.Antenna = Antenna;

	Antenna.prototype.setAmplitude = function(amplitude) {
	  this.amplitude = amplitude;
	};

	Antenna.prototype.getAmplitude = function() {
	  return this.amplitude;
	};

})(typeof exports === 'undefined' ? this : exports);


/* ===== SHOW NAVBAR ===== */ 
const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
        toggle.addEventListener('click', ()=>{
            // show navbar
            nav.classList.toggle('show');
            // change icon
            toggle.classList.toggle('bx-x');
            // add padding to body
            bodypd.classList.toggle('body-pd');
            // add padding to header
            headerpd.classList.toggle('body-pd');
        });
    }
}

showNavbar('header-toggle','nav-bar','body-pd','header');

/* ===== LINK ACTIVE ===== */ 
const linkColor = document.querySelectorAll('.nav__link');

function colorLink(){
    if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'));
        this.classList.add('active');
    }
}
linkColor.forEach(l=> l.addEventListener('click', colorLink));