var vjtvcalendar;
document.addEventListener('DOMContentLoaded', function() {
  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendar.Draggable;

  var containerEl = document.getElementById('external-events');
  var calendarEl = document.getElementById('calendar');
  var checkbox = document.getElementById('drop-remove');

  // initialize the external events
  // -----------------------------------------------------------------

/*   new Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: function(eventEl) {
      var json_event = eventEl.getAttribute("data-event");
      var event_array = JSON.parse(json_event);
      var event_duration = event_array['duration'];
      var event_title = event_array['title'];
      var event_color = event_array['color'];

      var res = {
          title: event_title,
          duration: event_duration,
          backgroundColor: event_color,
      };
      console.log(res);
      return res;
    }
  });
 */  // initialize the vjtvcalendar
  // -----------------------------------------------------------------

  vjtvcalendar = new Calendar(calendarEl, {
    initialView: 'timeGridDay',
    nowIndicator: true,
    eventDurationEditable: false,
    slotDuration: '00:30:00',
    snapDuration: '00:00:00',
    eventOverlap: false,
    height: 2000,
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    aspectRatio: 2,
    expandRows: true,
    allDaySlot: false,
    events: '/api/getprograms2',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: function(calEvent, jsEvent, view) {
      var title = prompt('Event Title:', calEvent.title, { buttons: { Ok: true, Cancel: false} });

      if (title){
          calEvent.title = title;
          vjtvcalendar.fullCalendar('updateEvent',calEvent);
      }
    },
    editable: true,
    droppable: true, // this allows things to be dropped onto the vjtvcalendar
    eventDrop: function(info) {
      console.log("eventDrop")
      console.log(info)
      var all = vjtvcalendar.getEvents();
      for (var a = 0; a<all.length; a++) {
        console.log(all[a]._instance.range.start.toUTCString())
        console.log(all[a]._instance.range.start.toUTCString())
        console.log(new Date(all[a]._instance.range.start.toUTCString()));
        console.log("------------------");
      }
    },
    drop: function(info) {
      console.log("drop")
      console.log(info.date)
      // is the "remove after drop" checkbox checked?
      if (checkbox.checked) {
        // if so, remove the element from the "Draggable Events" list
        info.draggedEl.parentNode.removeChild(info.draggedEl);
      }
      if ($("#external-events").children().length==1) {
        $(".attachment-dropzone").show()
      }
    }
  });

  vjtvcalendar.render();
  $('.autocomplete_vjtv input').autoComplete({
    resolverSettings: {
        url: "/admin/api/getvideos/"+$(this).val()+"?vjtv=1"
    },
    bootstrapVersion: "4",
    minLength: 3,
    events: {
      search: addVideoAutocompleteVjtv/* ,
      formatResult: addvideoAutocompleteSelect */
    },
    noResultsText: "NO video found, think about to invite him to join AVnode"
  });
  $('.autocomplete_vjtv input').on('autocomplete.select', function (evt, item) {
    console.log(item)
    //var colors = {"PERFORMANCES": "purple", "VJ-DJ SETS": "red", "DOCS": "green", "VIDEO": "dodgerblue", "ADV": "orange"};
    var colors = {"5be8708afc39610000000195": "purple", "5be8708afc39610000000218": "red", "5be8708afc3961000000008e": "green", "5be8708afc3961000000008e": "green", "5be8708afc39610000000112": "dodgerblue"};    
    var append = $("<div id=\"vid"+item.value+"\" style=\"color: #FFF;font-weight: 400;border-color: "+colors[item.category]+"; background-color: "+colors[item.category]+";\" class=\"fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event\" data-event='{ \"title\": \""+ item.text +"\", \"duration\": \""+moment.utc(item.duration).format('HH:mm:ss')+"\", \"color\": \""+colors[item.category]+"\" }'><div class=\"fc-event-main\">"+ item.text + "</div></div>");
    
    $(".attachment-dropzone").hide()
    $(".autocomplete_vjtv input").val("")
    $("#external-events").append(append)
    console.log($("#external-events .fc-event"))
    new Draggable(containerEl, {
      itemSelector: '#vid'+item.value,
      eventData: function(eventEl) {
        var json_event = eventEl.getAttribute("data-event");
        var event_array = JSON.parse(json_event);
        var event_duration = event_array['duration'];
        var event_title = event_array['title'];
        var event_color = event_array['color'];
  
        var res = {
            title: event_title,
            duration: event_duration,
            backgroundColor: event_color,
        };
        console.log("new Draggable");
        console.log(res);
        return res;
      }
    });
      /*     setTimeout(function() {
      console.log("timeout")
      let draggableEl = document.getElementById('mydraggable');
      console.log(Draggable)
      console.log(draggableEl)
      new Draggable(draggableEl, {
        eventData: function(eventEl) {
          return {
            title: eventEl.innerText
          };
        }
      });  
    }, 3000);
 */  });
  $("#slotsmall").click(function(){
    //vjtvcalendar.setOption('height', $(this).data("height"));
    vjtvcalendar.setOption("slotDuration",$(this).data("slot"))
  })
  $("#slotmid").click(function(){
		console.log($(this).data("height"))
    vjtvcalendar.setOption('slotDuration', $(this).data("slot"));
  })
  $("#slotbig").click(function(){
    vjtvcalendar.setOption('slotDuration', $(this).data("slot"));
  })
});

addVideoAutocompleteVjtv = function (qry, callback, origJQElement) {
	$(".autocomplete_video_err").addClass("d-none")					
	/* 	$('.autocomplete_users input').on( "blur", function () {
		var inputinput = $(this);
	});
	$('.autocomplete_users input').on( "keyup", function () {
		var inputinput = $(this);
		console.log(this)
		inputinput.parent().find(".dropdown-menu").addClass("show") */
		if (qry.length>2) {
			$.ajax({
				url: "/admin/api/getvideos/"+qry+"?vjtv=1",
				method: "get",
				dataType: "json"
			}).done((data) => {
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text: data[item].title,
            duration: data[item].media.duration,
            category: data[item].categories[0]
					})
				}
				callback(res)
			});
		}
	//});
}
