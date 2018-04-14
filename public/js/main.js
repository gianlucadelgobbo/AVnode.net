$(document).ready(function(){
 //http://kenwheeler.github.io/slick/ 
    $('.carousel').slick({
      centerMode: true,
      centerPadding: '80px',
      slidesToShow: 3,
      arrows: true
    });

    $('.carousel_news').slick({
      centerMode: true,
      centerPadding: '80px',
      slidesToShow: 2,
      arrows: true
    });
    
    $( ".event_main_image_wrapper" ).click(function() {
      $( ".event_main_image_wrapper" ).toggleClass("expanded");
    });
    
  });  