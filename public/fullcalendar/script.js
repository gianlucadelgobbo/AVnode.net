document.addEventListener('DOMContentLoaded', function() {
  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendar.Draggable;

  var containerEl = document.getElementById('external-events');
  var calendarEl = document.getElementById('calendar');
  var checkbox = document.getElementById('drop-remove');

  // initialize the external events
  // -----------------------------------------------------------------

  new Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: function(eventEl) {
      return {
        title: eventEl.innerText
      };
    }
  });
  // initialize the vjtvcalendar
  // -----------------------------------------------------------------

  var vjtvcalendar = new Calendar(calendarEl, {
    initialView: 'timeGridDay',
    nowIndicator: true,
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
}    ,
          editable: true,
    droppable: true, // this allows things to be dropped onto the vjtvcalendar
    drop: function(info) {
      // is the "remove after drop" checkbox checked?
      if (checkbox.checked) {
        // if so, remove the element from the "Draggable Events" list
        info.draggedEl.parentNode.removeChild(info.draggedEl);
      }
    }
  });

  vjtvcalendar.render();
  vjtvcalendar.addEvent({
    "title": "Event 1",
    "start": "2022-01-27T09:00:00",
    "end": "2022-01-27T18:00:00"
  })
  $("#heightsmall").click(function(){
    vjtvcalendar.setOption('height', $(this).data("height"));
  })
  $("#heightmid").click(function(){
		console.log($(this).data("height"))
    vjtvcalendar.setOption('height', $(this).data("height"));
  })
  $("#heightbig").click(function(){
    vjtvcalendar.setOption('height', $(this).data("height"));
  })
});