$(document).ready(function(){
 
    $( ".event_main_image_wrapper" ).click(function() {
      $( ".event_main_image_wrapper" ).toggleClass("expanded");
    });

    $('.loop_2').owlCarousel({
      center: true,
      items:2,
      loop:false,
      margin:30,
      dots: false,
      nav: true,
      //autoplay: true,
      navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
      responsive:{
          600:{
              items:2
          }
        }
    });

    $('.loop_3items').owlCarousel({      
      items:3,
      loop:false,
      margin:30,
      stagePadding: 50,
      dots: false,
      nav: true,
      //autoplay: true,
      navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
      responsive:{
                    100:{
                        items:1
                    },
                    600:{
                    items:2
                    },
                    768:{
                        items:3
                    }
                }
    });

    $('.loop').owlCarousel({
      //center: true,
      stagePadding: 50,
      items:2,
      loop: false,
      margin:30,
      dots: false,
      nav: true,
      //autoplay: true,
      navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
      responsive:{
            100:{
                items:1
            },
            600:{
            items:2
            },
            768:{
                items:3
            }, 
            990:{
                items:4
            }

        }
    });
    
  });  