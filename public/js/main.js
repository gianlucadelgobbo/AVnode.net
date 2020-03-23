var goto = 0;
var oldgoto = 0;
function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $( ".event_main_image_wrapper" ).click(function() {
    //   $( ".event_main_image_wrapper" ).toggleClass("expanded");
    $( ".event_main_image_wrapper" ).toggleClass("expanded");    
  });
  
  if ($('.category-manager').length) {
    $('.category-manager input').change(function () {
      var name = $(this).val();
      var check = $(this).prop('checked');
      console.log("Change: " + name + " to " + check);
      console.log($('.category-manager').serialize());
      $.ajax({
        url: "/admin/api/setvideocategory",
        method: "post" ,
        data: $('.category-manager').serialize()
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(data) {
        console.log(data);
      });
  
      });
  }

  if ($('#vjtv').length) {
    console.log("vjtv");
    var options = {
      controls: true,
      bigPlayButton: false
    };
    var player = videojs('my-video', options, function onPlayerReady() {
      videojs.log('Your player is ready!');
      $(".playlist").height($("#my-video video").height()-58);
      $(".vjs-big-play-button").hide();
    
      // In this context, `this` is the player that was created by Video.js.
      //this.play();
    
      // How about an event listener?
      this.on('ended', function() {
        videojs.log('Awww...over so soon?!');
      });
    });
    /* $(".vjs-poster").on('click', function(ev) {
    }); */
    player.logo({
      image: 'https://vjtelevision.com/vjtelevision/images/VJTV_4x.svg',
      url: "https://vjtelevision.com",
      height: 50,
      offsetH: 20,
      offsetV: 20,
      position: 'top-left',
      width: 150
    });

    var now = new Date();
    $("#vjtv #date").html(now.toDateString());
    loadDay(now);

    $('#vjtv #datepicker').datepicker({
      dateFormat: 'yy-mm-dd',
      beforeShow: function (input, inst) {
        var rect = input.getBoundingClientRect();
        setTimeout(function () {
	        inst.dpDiv.css({ top: rect.top + 40 });
        }, 0);
      },
      //defaultDate: new Date('03/10/2017'), // this line is for testing
      beforeShowDay: highlightDays
    });
    $("#vjtv #datepicker").change(function(){
      var day = new Date($('#vjtv #datepicker').datepicker("getDate"));
      $("#vjtv #date").html(day.toDateString());
      loadDay(day);
    });

    $( "#vjtv #datepickerbutton" ).click(function( event ) {
      event.preventDefault();
      var visible = $("#vjtv #datepicker").datepicker("widget").is(":visible");
      $("#vjtv #datepicker").datepicker(visible ? "hide" : "show");
    });


    function highlightDays(date) {
      for (var i = 0; i < dates.length; i++) {
        if (new Date(dates[i].replace("-","/").replace("-","/")).toString() == date.toString()) {
            return [true, 'highlight'];
        }
      }
      return [true, ''];
    }
  
    function loadDay(day) {
      var daystr = day.getFullYear()+"-"+(("0" + (day.getMonth()+1)).slice(-2))+"-"+(("0" + (day.getDate())).slice(-2));
      if (dates.indexOf(daystr)===-1) {
        alert("No programming for this date!!!");
      } else {
        $('#vjtv .playlist').html("<div class=\"vjs-waiting\"><div class=\"vjs-loading-spinner\"></div></div>");
        $.ajax({
          url: "/api/getprograms",
          method: "get",
          data: {day: daystr}
        })
        .done(function(data) {
          var timeA = data.map(item => {return new Date(item.programming).getTime()});
          var goal = new Date().getTime();
          if (goal>=timeA[0] && goal<timeA[timeA.length-1]) {
            var closest = timeA.reduce(function(prev, curr) {
              return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
            });
            oldgoto = timeA.indexOf(closest);
            goto = timeA.indexOf(closest);
          } else {
            oldgoto = goto = 0;
          }
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
          player.playlist(playlist, goto);
          player.on('playlistitem', (item) => {
            oldgoto = goto;
            goto = player.playlist.currentItem();
            setMarker();
          });
          player.playlist.autoadvance(0);
          //player.playlist.currentItem(goto);
          $("#vjtv .playlist").height($("#my-video video").height()-58);
          $('#vjtv .playlist').html(html);
          $(".vjs-big-play-button").show();
          var setMarker = () => {
            $('#P'+oldgoto).addClass("bg-dark");
            $('#P'+oldgoto).removeClass("bg-danger");
            $('#P'+goto).removeClass("bg-dark");
            $('#P'+goto).addClass("bg-danger");
            $('#vjtv .playlist').imagesLoaded(() => {
              $('#vjtv .playlist').animate({scrollTop: $("#P"+goto).position().top}, 2000);
            });
            oldgoto = goto;
          }
          $( ".playlist-item" ).click(function( event ) {
            //$('#P'+goto).addClass("bg-dark");
            //$('#P'+goto).removeClass("bg-danger");
            //goto = parseInt($(this).attr("id").substring(1));
            player.playlist.currentItem(parseInt($(this).attr("id").substring(1)));
            //$('#P'+goto).removeClass("bg-dark");
            //$('#P'+goto).addClass("bg-danger");
          });
        })
        .fail(function(data) {
          $('#vjtv .playlist').html("error");
        });
      }
    }
    
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


