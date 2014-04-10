$( document ).ready(function() {
 
   $(".indicator-textarea").val("Sample comment or evidence");
   $(".remarks-textarea").val("Make your remarks here");

   $( ".btn-group" ).each(function( index ) {
       
       randomElements = jQuery(".btn-group").children().get().sort(function() { 
         return Math.round(Math.random())
       }).slice(0,index);
       
       $(randomElements).addClass("active");
       
   });

});
