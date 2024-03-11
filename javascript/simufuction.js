
// Get DOM Elements
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

// Events
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = 'block';
}

// Close
function closeModal() {
  modal.style.display = 'none';
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}



// To Reset Connections
function reset() {
    window.location.reload();
    counter = 0;
}



/*===== SHOW NAVBAR  =====*/ 
const showNavbar = (toggleId, navId, bodyId, headerId) =>{
  const toggle = document.getElementById(toggleId),
  nav = document.getElementById(navId),
  bodypd = document.getElementById(bodyId),
  headerpd = document.getElementById(headerId)

  // Validate that all variables exist
  if(toggle && nav && bodypd && headerpd){
      toggle.addEventListener('click', ()=>{
          // show navbar
          nav.classList.toggle('show')
          // change icon
          toggle.classList.toggle('bx-x')
          // add padding to body
          bodypd.classList.toggle('body-pd')
          // add padding to header
          headerpd.classList.toggle('body-pd')
      })
  }
}

showNavbar('header-toggle','nav-bar','body-pd','header')

/*===== LINK ACTIVE  =====*/ 
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
  if(linkColor){
      linkColor.forEach(l=> l.classList.remove('active'))
      this.classList.add('active')
  }
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))


/*
 *  Constructs the instrument panel for controlling the radiation pattern
 */

(function(exports) {
	
  function ControlPanel (antennaArray, plot) {
    this.aa = antennaArray;
    this.plotter = plot;
  }

  exports.ControlPanel = ControlPanel;

  ControlPanel.prototype.initialize = function(ctx) {
    var self = this;
    $("li").each(function(index) {
      var s = "#slider" + (index+1);
      var t = "#input" + (index+1);

      $(s).slider({
       orientation: "vertical",
       min: 0,
       max: constants.MAX_AMP,
       step:0.1,
       value: constants.INIT_AMP,
       
       slide: function(event, ui) {
             $(t).val(ui.value);
             self.aa.changeAmplitude(ui.value, index);
             self.updatePlot(ctx);
         }

     });
     $(t).val($(s).slider("option", "value"));


      $(t).change(function() {
        
         var value = this.value,
           selector = $(s);  
         selector.slider("value", value);

         self.aa.changeAmplitude(value, index);
           self.updatePlot(ctx);

     });
   });

     // disable all but first two
   this.enableSliders(constants.INIT_NUM, ctx);

    var sliderSpacing = $("#sliderSpacing").slider({
       orientation: "horizontal",
       min: constants.MIN_SPACING,
       max: constants.MAX_SPACING,
       step: 1,
       value: constants.SPACING_INITIAL_VALUE,
       slide: function(event, ui) {
             $("#inputSpacing").val(ui.value / 100);
             self.aa.setSpacing(ui.value / 100);
             self.updatePlot(ctx);
         }

     });

    sliderSpacing.after('<div class="ui-slider-legend"><p style="width:205px">0&lambda;</p><p>2.5&lambda;</p></div>');


    $("#inputSpacing").val($("#sliderSpacing").slider("option", "value") / 100);

    $("#inputSpacing").change(function() {
      
       var value = this.value,
         selector = $("#sliderSpacing");  
       selector.slider("value", value * 100 );
       self.aa.setSpacing(value);
       self.updatePlot(ctx);

   });
    
    var sliderPhase = $("#sliderPhase").slider({
       orientation: "horizontal",
       min: -180,
       max: 180,
       step:1,
       value: constants.INIT_PHASE,
       slide: function(event, ui) {
             $("#inputPhase").val(ui.value);
             self.aa.setPhase(ui.value);
             self.updatePlot(ctx);
         }

     });

   $("#inputPhase").val($("#sliderPhase").slider("option", "value") / 100);
    $("#inputPhase").change(function() {
       var value = this.value,
         selector = sliderPhase;  
       selector.slider("value", value );
       self.aa.setPhase(value);
       self.updatePlot(ctx);
   });

   sliderPhase.after('<div class="ui-slider-legend"><p style="width:205px">-180&deg;</p><p>180&deg;</p></div>');

   var spinner = $("#numElements").spinner({

     spin: function(event, ui) {
       if (ui.value > 10 || ui.value < 2) {
         return false;
       }
       self.enableSliders(ui.value, ctx);
     }
    });

    spinner.spinner("value", constants.INIT_NUM);

    // set button event listener for plot type
     $("#polar").button().click(function(event) {
          $(this).addClass("selected");
          $("#rect").removeClass("selected");
       self.updatePlot (ctx, constants.POLAR);
     });

     $("#rect").button().click(function(event) {
         $(this).addClass("selected");
         $("#polar").removeClass("selected");
       self.updatePlot (ctx, constants.RECT);
     });

     $("#reset").button().click(function(event) {
       self.resetPlot (ctx);
     });

     $("#unitType").change(function() {
     if (this.checked)	{
       self.plotter.setDecibel (true);
     } else {
       self.plotter.setDecibel (false);
     }
     self.updatePlot (ctx);
   });
    
 };

 ControlPanel.prototype.enableSliders = function(num, ctx) {

    $("li").each(function(index) {
      var s = "#slider" + (index + 1);
      var t = "#input" + (index + 1);
      var icon = "#icon" + (index + 1);
      if (index < num) {
        $(s).slider('enable');
        $(t).prop('disabled', false);
        $(icon).attr("src", constants.ICON_ON);
      } else {
        $(s).slider("value", constants.INIT_AMP);
        $(t).val(constants.INIT_AMP);
        $(s).slider('disable');
        $(t).prop('disabled', true);
        $(icon).attr("src", constants.ICON_OFF);
      }
    });

    this.aa.setElementNumber(num);
    this.updatePlot (ctx);
 };

 ControlPanel.prototype.updatePlot = function(ctx, type) {
   this.aa.computeAF(1);
   this.plotter.updateAF(this.aa.getArrayFactor());

   if (type) this.plotter.setGraph (type);
   
   this.plotter.paint (ctx);

   var event = new CustomEvent('update', { 
     'detail' : { 
       'af' : this.aa.getArrayFactor() 
     } 
   });

   window.dispatchEvent(event);
 };

 ControlPanel.prototype.resetPlot = function(ctx) {
   
   // reset element spinner
   $("#numElements").spinner("value", constants.INIT_NUM).change();

   // reset sliders
   this.enableSliders (constants.INIT_NUM, ctx);
   for (var i = 1; i <= constants.INIT_NUM; i++) {
     //$("#slider" + (i + 1)).slider("value", constants.INIT_AMP).change();
      $("#input" + i).val(constants.INIT_AMP).change();
   }

   // reset spacing
   $("#inputSpacing").val(constants.INIT_SPACING).change();

   // reset phase
   $("#inputPhase").val(constants.INIT_PHASE).change();

   // re-plot
   this.updatePlot (ctx);
 };

})(typeof exports === 'undefined' ? this : exports);

