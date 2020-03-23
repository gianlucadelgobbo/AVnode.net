var goto = 0;
var oldgoto = 0;
var dates = [];
$(document).ready(function(){
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
    $.ajax({
      url: "https://avnode.net/api/getprogramsdays",
      method: "get"
    })
    .done(function(dd) {
      dates = dd;
      loadDay(now);
    })
    .fail(function(data) {
      $('#vjtv .playlist').html("error");
    });


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
          url: "https://avnode.net/api/getprograms",
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
            html+="    <div class=\"col\"><div class=\"pl-2\">"+data[a].programming.split(".")[0].replace("T", "<br />")+"</div></div>";
            html+="    <div class=\"col\"><div class=\"pr-2 text-right\">"+data[a].category.name+"<br />"+data[a].video.media.durationHR+"</div></div>";
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
  }
});  


