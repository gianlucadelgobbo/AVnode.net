$(document).ready(function(){
	if ($("#birthday") && $("#birthday").length) {
		$('#birthday').datetimeEntry({datetimeFormat: 'D/O/Y', spinnerBigImage: '/datetimeentry/spinnerDefaultBig.png'});
  }
  
	if ($("#filters") && $("#filters").length) {
    $("#filters a").on("click", function(event){
      event.preventDefault();
      $('#collapsefilters').hasClass('d-none') ? $('#collapsefilters').removeClass('d-none') : $('#collapsefilters').addClass('d-none');
    });
  }

	if ($(".form-control") && $(".form-control").length) {
    $(".form-control").on("focus", function(){
      if ($(this).parent().find('.badge').length) $(this).parent().find('.badge').remove();
    });
  }

  if ($(".location-search-input") && $(".location-search-input").length) {
		$(".location-search-input").on("keyup", function() {
			$(this).parent().find(".lat").val("");
			$(this).parent().find(".lng").val("");
			$(this).parent().find(".locality").val("");
			$(this).parent().find(".country").val("");
			$(this).parent().find(".formatted_address").val("");
		});
		$(".location-search-input").on("blur", function() {
			$(this).val($(this).parent().find(".formatted_address").val());
		});
		addLocationAutocomplete = function () {
			$(".location-search-input")
			.geocomplete({
				fields: ["address_components", "geometry"]
			})
			.bind("geocode:result", (event, place) => {
				var res = {
					"geometry": {
						"lat": place.geometry.location.lat(),
						"lng": place.geometry.location.lng()
					},
					"locality": "",
					"country": "",
					"formatted_address": ""
				}
				for(var item in place.address_components) {
					if (place.address_components[item].types.indexOf("country")!==-1) {
						res.country = place.address_components[item].long_name
					}
					if (place.address_components[item].types.indexOf("locality")!==-1) {
						res.locality = place.address_components[item].long_name
					}
				}
				if (res.locality=="") {
					for(var item in place.address_components) {
						if (place.address_components[item].types.indexOf("administrative_area_level_3")!==-1) {
							res.locality = place.address_components[item].long_name
						}
					}
				}
				res.formatted_address = res.locality && res.country ? res.locality +", "+ res.country : res.locality ? res.locality : res.country ? res.country : "";
				event.target.value = res.formatted_address
				$(event.target).parent().find(".lat").val(res.geometry.lat)
				$(event.target).parent().find(".lng").val(res.geometry.lng)
				$(event.target).parent().find(".locality").val(res.locality)
				$(event.target).parent().find(".country").val(res.country)
				$(event.target).parent().find(".formatted_address").val(res.formatted_address)
				$(event.target).parent().find(".location-search-input").val(res.formatted_address)
				console.log(res);
			});
		}
		addLocationAutocomplete();
	}

  $('#dropdownContents a').click(function (event) {
    console.log("dropdownContents")
    event.preventDefault();
    var button = $(this) // Button that triggered the modal
    var user = button.data('user') // Extract info from data-* attributes
    if (!user) {
      window.location.href = "/login";
    } else {
      var sez = button.data('sez') // Extract info from data-* attributes
      var title = button.data('title') // Extract info from data-* attributes
      var labelfield = button.data('labelfield') // Extract info from data-* attributes
      var param = button.data('param') // Extract info from data-* attributes
      var _id = button.data('id') // Extract info from data-* attributes
      var newsez = button.data('newsez') // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      var modal = $('#modalNewContent')
      modal.find('.modal-title').text(title);
      modal.find('.labelfield').text(labelfield);
      modal.find('.input').attr("placeholder", labelfield);
      modal.find('.input').attr("name", param);
      modal.find('.sez').val(sez);
      modal.find('.id').val(_id);
      modal.find('.newsez').val(newsez);
      if (sez == "videos") {
        modal.find('.video-only').removeClass("d-none");
      } else {
        modal.find('.video-only').addClass("d-none");
      }
        
      $('#modalNewContent').modal();
    }
  });
  
  $( "#modalNewContent form" ).submit(function( event ) {
    event.preventDefault();
    var post = $( this ).serialize();
    /* $( this ).serializeArray().map(n => {
      post[n['name']] = n['value'].trim();
    });
     */
    var sez = $('.sez').val();
    var url;
    if ($('.id').val()){
      url = "/admin/api/"+sez+"/"+$('.id').val()+"/"+$('.newsez').val()+"/new/";
    } else {
      url = "/admin/api/"+sez+"/new/";
    }
    $.ajax({
      url: url,
      method: "post",
      data: post
    })
    .done(function(data) {
      if ($('.id').val()){
        window.location.href = "/admin/"+$('.newsez').val()+"/"+data._id+"/public";
      } else {
        window.location.href = "/admin/"+sez+"/"+data._id+"/public";
      }
    })
    .fail(function(err) {
      $( "#modalNewContent form" ).find(".alert").html(err.responseJSON.message).removeClass("d-none").removeClass("alert-success").addClass("alert-danger");
    });
  })

  $('[data-toggle="tooltip"]').tooltip();
  /* $( ".event_main_image_wrapper" ).click(function() {
    //   $( ".event_main_image_wrapper" ).toggleClass("expanded");
    $( ".event_main_image_wrapper" ).toggleClass("expanded");    
  }); */
  
  if ($('.category-manager').length) {
    $('.category-manager input').change(function () {
      var name = $(this).val();
      var check = $(this).prop('checked');
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
  if ($('.exclude-manager').length) {
    $('.exclude-manager input').change(function () {
      var name = $(this).val();
      var check = $(this).prop('checked');
      $.ajax({
        url: "/admin/api/setvideoexclude",
        method: "post" ,
        data: $('.exclude-manager').serialize()
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(data) {
        console.log(data);
      });
  
      });
  }

  $('.loop_2').owlCarousel({
    center: true,
    items:2,
    loop:false,
    margin:30,
    dots: false,
    nav: true,
    //autoplay: true,
    navText : ["<div class='carousel_nav carousel_nav_left'><i class='icon-chevron-left'></i></div>",
    "<div class='carousel_nav carousel_nav_right'><i class='icon-chevron-right'></i></div>"],
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
    navText : ["<div class='carousel_nav carousel_nav_left'><i class='icon-chevron-left'></i></div>",
    "<div class='carousel_nav carousel_nav_right'><i class='icon-chevron-right'></i></div>"],
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
    navText : ["<div class='carousel_nav carousel_nav_left'><i class='icon-chevron-left'></i></div>",
    "<div class='carousel_nav carousel_nav_right'><i class='icon-chevron-right'></i></div>"],
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
    navText : ["<div class='carousel_nav carousel_nav_left'><i class='icon-chevron-left'></i></div>",
    "<div class='carousel_nav carousel_nav_right'><i class='icon-chevron-right'></i></div>"],
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

/* $('.video_item_wrappera a').click(function( event ) {
  event.preventDefault();
  $('#modalFull').modal('show');
  console.log($(this).attr("href"))
  $.ajax({
    url: $(this).attr("href"),
    method: "get"
  })
  .done(function(data) {
    $("#modalFull .loading").addClass("d-none");
    if ($(data).find(".container.content .main_title").html()) {
      $("#modalFull .title").html($(data).find(".container.content .main_title").html());
    } else {
      
    }
    $("#modalFull .cnt").append($(data).find(".container.content"));
    videojs(document.querySelector('.video-js'));
    //console.log($(data).find(".container.content").html())
  })
  .fail(function(err) {
    $("#modalFull .cnt").html("LOADING ERROR");
  });
});  */ 
var LG;
$('.video_item_wrapper a').click(function( event ) {
  event.preventDefault();
  if (LG) LG.destroy();
  $.ajax({
    url: $(this).attr("href")+"?api=1",
    method: "get"
  })
  .done(function(data) {
    const list = data.videos && data.videos[0] ? data.videos[0] : data;
    const $dynamicGallery = document.getElementById('lightGallery');
    if (list.media.iframe) {
      const dynamicEl = [{
        src:list.media.iframe,
        subHtml: '<h4>'+list.title+'</h4>',
      }];
      const conf = {
        iframe: true,
        dynamic: true,
        download: false,
        plugins: [
          lgVideo
        ],
        dynamicEl: dynamicEl
      };
    } else {
      var dynamicEl = [{
        video:{"source": [{"src": "https://avnode.net"+list.media.file, "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}},
        poster: list.imageFormats.large,
        subHtml: '<h4>'+list.title+'</h4>',
      }];
      const conf = {
        dynamic: true,
        download: false,
        plugins: [
          lgVideo
        ],
        dynamicEl: dynamicEl
      };
    }
    LG = lightGallery($dynamicGallery, conf);
    LG.openGallery(0);
  })
  .fail(function(err) {
    console.log("LOADING ERROR");
  });
});  

$('.gallery_item_wrapper a').click(function( event ) {
  event.preventDefault();
  $.ajax({
    url: $(this).attr("href")+"?api=1",
    method: "get"
  })
  .done(function(data) {
    console.log(data)
    const list = data.galleries && data.galleries[0] ? data.galleries[0] : data;
    const $dynamicGallery = document.getElementById('lightGallery');
    var dynamicEl = [];
    for(var item in list.medias) {
      dynamicEl.push({
        src: list.medias[item].imageFormats.large,
        thumb: list.medias[item].imageFormats.small,
        subHtml: '<h4>'+list.medias[item].title+'</h4>',
      });
    }
    console.log(dynamicEl)
    const dynamicGallery = lightGallery($dynamicGallery, {
        dynamic: true,
        download: false,
        plugins: [
          lgZoom,
          lgThumbnail
        ],
        dynamicEl: dynamicEl
    });
    dynamicGallery.openGallery(0);
  })
  .fail(function(err) {
    console.log("LOADING ERROR");
  });
});  

