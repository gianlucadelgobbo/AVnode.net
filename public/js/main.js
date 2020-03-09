$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $( ".event_main_image_wrapper" ).click(function() {
        //   $( ".event_main_image_wrapper" ).toggleClass("expanded");
        $( ".event_main_image_wrapper" ).addClass("expanded");    
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

    $('.mono').owlCarousel({
      //center: true,    
      items:0,
      loop: true,
      margin:30,
      dots: false,
      nav: true,
      autoplay: true,
      navText : ["<div class='carousel_nav carousel_nav_left'><i class='fa fa-chevron-left'></i></div>",
      "<div class='carousel_nav carousel_nav_right'><i class='fa fa-chevron-right'></i></div>"],
      responsive:{
            100:{
                items:1
            },
            600:{
            items:1
            },
            768:{
                items:1
            }, 
            990:{
                items:1
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

  $( ".print-perf" ).click(function( event ) {
    event.preventDefault();
    var user = $(this).data('user');
    if (user) {
      $('#msg_modal .modal-body').html('This featur is under development, we keep you posted.');
      $('#msg_modal .modal-footer button').html('CONTINUE');
      $('#msg_modal .modal-footer button').click(function( event ) {
        $('#msg_modal ').modal('hide');
      });  
    } else {
      var slug = $(this).data('slug');
      $('#msg_modal .modal-body').html('Please login to use this feature.');
      $('#msg_modal .modal-footer button').html('LOGIN');
      $('#msg_modal .modal-footer button').click(function( event ) {
        window.location.href="/login?returnTo=/performances/"+slug+"/";
      });  
    }
    $('#msg_modal ').modal('show');
  });

  $( ".book-perf" ).click(function( event ) {
    event.preventDefault();
    var user = $(this).data('user');
    $('#modalBookPerf .alert').addClass('d-none');
    $('#modalBookPerf .alert').removeClass('alert-danger');
    $('#modalBookPerf .alert').removeClass('alert-success');
    if (user) {
      $('#modalBookPerf .modal-footer .btn-primary').click(function( event ) {
        $('#modalBookPerf .alert').addClass('d-none');
        $('#modalBookPerf .alert').removeClass('alert-danger');
        $('#modalBookPerf .alert').removeClass('alert-success');
        var datastring = $("#modalBookPerf form").serialize();
        console.log(datastring);
        $.ajax({
          type: "POST",
          url: "/admin/api/bookingrequest",
          data: datastring
        }).
        done(function(data) {
          if (data && data.message) {
            $('#modalBookPerf .alert').html(data.message);
            $('#modalBookPerf .alert').addClass('alert-danger');
            $('#modalBookPerf .alert').removeClass('d-none');
          } else {
            $('#modalBookPerf .alert').html("Request sent with success.");
            $('#modalBookPerf .alert').addClass('alert-success');
            $('#modalBookPerf .alert').removeClass('d-none');
          }
          //console.log(data);
        })
        .fail(function (jqXHR, textStatus) {
          $('#modalBookPerf .alert').html("Internal Server Error");
          $('#modalBookPerf .alert').addClass('alert-danger');
          $('#modalBookPerf .alert').removeClass('d-none');
        });
      });  
      $('#modalBookPerf ').modal('show');
    } else {
      var slug = $(this).data('slug');
      $('#msg_modal .modal-body').html('Please login to use this feature.');
      $('#msg_modal .modal-footer button').html('LOGIN');
      $('#msg_modal .modal-footer button').click(function( event ) {
        window.location.href="/login?returnTo=/performances/"+slug+"/";
      });  
      $('#msg_modal ').modal('show');
    }
  });

});  


