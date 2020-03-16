var goto = 0;
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $( ".event_main_image_wrapper" ).click(function() {
    //   $( ".event_main_image_wrapper" ).toggleClass("expanded");
    $( ".event_main_image_wrapper" ).toggleClass("expanded");    
  });

  if ($('#vjtv').length) {
    console.log("vjtv");
    var options = {
      controls: true,
      bigPlayButton: false
    };
    var player = videojs('my-video', options, function onPlayerReady() {
      videojs.log('Your player is ready!');
      $(".vjs-big-play-button").hide();
    
      // In this context, `this` is the player that was created by Video.js.
      //this.play();
    
      // How about an event listener?
      this.on('ended', function() {
        videojs.log('Awww...over so soon?!');
      });
    });
    $(".vjs-poster").on('click', function(ev) {
      player.playlist([{
        sources: [{
          src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
          type: 'video/mp4'
        }],
        poster: 'http://media.w3.org/2010/05/sintel/poster.png'
      }, {
        sources: [{
          src: 'http://vjs.zencdn.net/v/oceans.mp4',
          type: 'video/mp4'
        }],
        poster: 'http://www.videojs.com/img/poster.jpg'
      }, {
        sources: [{
          src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
          type: 'video/mp4'
        }],
        poster: 'http://media.w3.org/2010/05/bunny/poster.png'
      }, {
        sources: [{
          src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
          type: 'video/mp4'
        }],
        poster: 'http://media.w3.org/2010/05/video/poster.png'
      }]);
      player.playlist.autoadvance(0);
      player.playlist.currentItem(2);
    });

    var now = new Date();

    $.ajax({
      url: "/api/getprograms",
      method: "post"/* ,
      data: {month: now.getFullYear()+"-"+("0" + (now.getMonth() + 1)).slice(-2)} */
    })
    .done(function(data) {
      var timeA = data.map(item => {return new Date(item.programming).getTime()});
      var goal = new Date().getTime();
      var closest = timeA.reduce(function(prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
      goto = timeA.indexOf(closest);
      console.log(goto);
      var html = "<ul class=\"list-unstyled\">"
      var playlist = [];
      for (var a=0;a<data.length;a++) {
        playlist.push({
          sources: [{
            src: "https://avnode.net"+data[a].video.media.file,
            type: 'video/mp4'
          }],
          poster: data[a].video.imageFormats.small
        })
        var id = new Date(data[a].programming).getTime();
        html+="<li class=\"playlist-item bg-dark mb-3\" id=\"P"+a+"\">";
        html+="  <div class=\"row text-monospace small playlist-header\">";
        html+="    <div class=\"col\"><div class=\"pl-2\">"+data[a].programming.split(".")[0].replace("T", " | ")+"</div></div>";
        html+="    <div class=\"col\"><div class=\"pr-2 text-right\">"+data[a].category.name+" | "+data[a].video.media.durationHR+"</div></div>";
        html+="  </div>";
        html+="  <div class=\"media p-2\" id=\"P"+a+"\">";
        html+="    <img class=\"mr-3\" style=\"width:100px\" src=\""+data[a].video.imageFormats.small+"\">";
        html+="    <div class=\"media-body\">";
        html+="      <h5 class=\"mt-0 mb-1\">"+data[a].video.title+"</h5>";
        html+="      <ul class=\"list-inline small\">"+data[a].video.users.map(user =>{return "<li>"+user.stagename+"</li>"})+"</ul>";
        html+="    </div>";
        html+="  </div>";
        html+="   <div class=\"more p-2\"><a href=\"/videos/"+data[a].video.slug+"/\" class=\"badge badge-primary\">MORE</a></div>";
        html+="</li>";
      }
      html+="</ul>";
      player.playlist(playlist);
      player.playlist.autoadvance(0);
      player.playlist.currentItem(goto);
      $('#vjtv .playlist').html(html);
      $('#vjtv .playlist').imagesLoaded( function() {
        $('#vjtv .playlist').animate({
          scrollTop: $("#P"+goto).offset().top-(window.innerHeight/2)
        }, 2000);
        
      });
      $(".vjs-big-play-button").show();
      $('#P'+goto).removeClass("bg-dark");
      $('#P'+goto).addClass("bg-danger");
      $( ".playlist-item" ).click(function( event ) {
        console.log("goto");
        console.log(goto);
        $('#P'+goto).addClass("bg-dark");
        $('#P'+goto).removeClass("bg-danger");
        goto = parseInt($(this).attr("id").substring(1));
        console.log(goto);
        player.playlist.currentItem(goto);
        $('#P'+goto).removeClass("bg-dark");
        $('#P'+goto).addClass("bg-danger");
      });
    })
    .fail(function(data) {
      $('#vjtv .playlist').html("error");
    });

    
    // Play through the playlist automatically.
  }

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
    var user = $(this).data('user');
    if (!user) {
      event.preventDefault();
      var slug = $(this).data('slug');
      $('#msg_modal .modal-body').html('Please login to use this feature.');
      $('#msg_modal .modal-footer button').html('LOGIN');
      $('#msg_modal .modal-footer button').click(function( event ) {
        window.location.href="/login?returnTo=/performances/"+slug+"/";
      });  
      $('#msg_modal ').modal('show');
    }
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

  $( ".cv_performer" ).click(function( event ) {
    var user = $(this).data('user');
    if (!user) {
      event.preventDefault();
      var slug = $(this).data('slug');
      $('#msg_modal .modal-body').html('Please login to use this feature.');
      $('#msg_modal .modal-footer button').html('LOGIN');
      $('#msg_modal .modal-footer button').click(function( event ) {
        window.location.href="/login?returnTo=/"+slug+"/";
      });  
      $('#msg_modal ').modal('show');
    }
  });

  $( ".contact_performer" ).click(function( event ) {
    event.preventDefault();
    var user = $(this).data('user');
    $('#modalContact .alert').addClass('d-none');
    $('#modalContact .alert').removeClass('alert-danger');
    $('#modalContact .alert').removeClass('alert-success');
    if (user) {
      $('#modalContact .modal-footer .btn-primary').click(function( event ) {
        $('#modalContact .alert').addClass('d-none');
        $('#modalContact .alert').removeClass('alert-danger');
        $('#modalContact .alert').removeClass('alert-success');
        var datastring = $("#modalContact form").serialize();
        $.ajax({
          type: "POST",
          url: "/admin/api/contact",
          data: datastring
        }).
        done(function(data) {
          if (data && data.message) {
            $('#modalContact .alert').html(data.message);
            $('#modalContact .alert').addClass('alert-danger');
            $('#modalContact .alert').removeClass('d-none');
          } else {
            $('#modalContact .alert').html("Request sent with success.");
            $('#modalContact .alert').addClass('alert-success');
            $('#modalContact .alert').removeClass('d-none');
          }
          //console.log(data);
        })
        .fail(function (jqXHR, textStatus) {
          $('#modalContact .alert').html("Internal Server Error");
          $('#modalContact .alert').addClass('alert-danger');
          $('#modalContact .alert').removeClass('d-none');
        });
      }); 
      $('#modalContact ').modal('show');
    } else {
      var slug = $(this).data('slug');
      $('#msg_modal .modal-body').html('Please login to use this feature.');
      $('#msg_modal .modal-footer button').html('LOGIN');
      $('#msg_modal .modal-footer button').click(function( event ) {
        window.location.href="/login?returnTo=/"+slug+"/";
      });  
      $('#msg_modal ').modal('show');
    }
  });

});  


