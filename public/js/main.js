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
      navText : ["<div class='carousel_nav carousel_nav_left'><i class='fa fa-chevron-left'></i></div>",
      "<div class='carousel_nav carousel_nav_right'><i class='fa fa-chevron-right'></i></div>"],
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
      navText : ["<div class='carousel_nav carousel_nav_left'><i class='fa fa-chevron-left'></i></div>",
      "<div class='carousel_nav carousel_nav_right'><i class='fa fa-chevron-right'></i></div>"],
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
      navText : ["<div class='carousel_nav carousel_nav_left'><i class='fa fa-chevron-left'></i></div>",
      "<div class='carousel_nav carousel_nav_right'><i class='fa fa-chevron-right'></i></div>"],
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


// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .not('a.tab_link')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 800) {
        $("#to_top").addClass("to_top_visibile");
    } else {
        $("#to_top").removeClass("to_top_visibile");
    }
});  


  });  