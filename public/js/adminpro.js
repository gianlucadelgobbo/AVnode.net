$(function() {
  function sortUnorderedList(ul, sortDescending) {
    if(typeof ul == "string")
      ul = document.getElementById(ul);
  
    // Idiot-proof, remove if you want
    if(!ul) {
      alert("The UL object is null!");
      return;
    }
  
    // Get the list items and setup an array for sorting
    var lis = ul.getElementsByTagName("li");
    var vals = [];
  
    // Populate the array
    for(var i = 0, l = lis.length; i < l; i++)
      vals.push(lis[i].innerHTML);
  
    // Sort it
    vals.sort();
  
    // Sometimes you gotta DESC
    if(sortDescending)
      vals.reverse();
  
    // Change the list on the page
    for(var i = 0, l = lis.length; i < l; i++)
      lis[i].innerHTML = vals[i];
  }
  $('.sorter').click(function() {
    const id = $(this).data("target");
    sortUnorderedList(id);
});
  // Hide submenus
  $('#body-row .collapse').collapse('hide'); 

  // Collapse/Expand icon
  $('#collapse-icon').addClass('fa-angle-double-left'); 

  // Collapse click
  $('[data-toggle=sidebar-collapse]').click(function() {
      SidebarCollapse();
  });

  function SidebarCollapse () {
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#sidebar-container .badge').toggleClass('d-none');
    $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
    if ($('#sidebar-container .fa-arrow-alt-circle-left')) {
      $('#sidebar-container .fa-arrow-alt-circle-left').addClass('fa-arrow-alt-circle-right').removeClass('fa-arrow-alt-circle-left');
    } else {
      $('#sidebar-container .fa-arrow-alt-circle-right').addClass('fa-arrow-alt-circle-left').removeClass('fa-arrow-alt-circle-right');
    }
    
    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if ( SeparatorTitle.hasClass('d-flex') ) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }
    
    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-arrow-circle-o-left fa-arrow-circle-o-right');
  }
  if (document.querySelector("#print")) {
    document.querySelector("#print").addEventListener("click", function() {
      window.print();
    });
  }
  $(".lightgallery").lightGallery(); 
  $(".lightvideos").lightGallery({
    videojs: true
  }); 
  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 800) {
        $("#to_top").addClass("to_top_visibile");
    } else {
        $("#to_top").removeClass("to_top_visibile");
    }
  });  
  $(".edit-availability").on('click', function(ev) {
    ev.preventDefault();
    const id = $(this).data("program");
    $('#modalEdit .content').html("Loading data...");
    $('#modalEdit .alert-danger').addClass('d-none');
    $('#modalEdit .alert-success').addClass('d-none');
    $('#modalEdit').modal();
    $.ajax({
      url: "/admin/api/editsubscription",
      method: "post",
      data: {id:id}
    }).done(function(data) {
      $('#modalEdit .content').html(data);
      bindEditSubscription();
    });
  });
  $("#editSubscription").submit(function(ev) {
    ev.preventDefault();
    var datastring = $("#editSubscription").serialize();
    $.ajax({
      type: "POST",
      url: "/admin/api/editsubscriptionsave",
      data: datastring
    }).
    done(function(data) {
      if (data.errors) {
        $('#modalEdit .alert-danger').html(data.errors.subscriptions.message);
        $('#modalEdit .alert-danger').removeClass('d-none');
      } else {
        $('#modalEdit .alert-success').html("Data saved with success.");
        $('#modalEdit .alert-success').removeClass('d-none');
      }
      //console.log(data);
    })
    .fail(function (jqXHR, textStatus) {
      $('#modalEdit .alert-danger').html("Internal Server Error");
      $('#modalEdit .alert-danger').removeClass('d-none');
    });
  });
  function bindEditSubscription(){
      $(".pack_main input").change(function(ev) {
      if (this.checked) {
        $(this).parent().parent().find(".pack_sub").slideDown('slide');
      } else {
        $(this).parent().parent().find(".pack_sub").slideUp('slide');
      }
    });  
    $(".switch").change(function(ev) {
      const stagename = $(this).data("stagename");
      const count = $(this).data("count");
      const subscriber_id = $(this).data("subscriber_id");
      if (this.checked) {
        $(this).parent().parent().parent().find('.block_active input').removeAttr('disabled');
        $(this).parent().find('.stagename').val(stagename);
        $(this).parent().find('.subscriber_id').val(subscriber_id);
        $(this).parent().parent().parent().find('.block_active').slideDown('slide');
      } else {
        $(this).parent().parent().parent().find('.block_active input').attr('disabled', 'disabled');
        $(this).parent().find('.stagename').removeAttr('value');
        $(this).parent().find('.subscriber_id').removeAttr('value');
        $(this).parent().parent().parent().find('.block_active').slideUp('slide');
      }
    });
    $(".freezed").change(function(ev) {
      const count = $(this).data("count");
      if (this.checked) {
        $(this).parent().parent().parent().find('.switch').attr('disabled', 'disabled');
        $(this).parent().parent().parent().find('.block_freezed').removeClass('d-none');
        $(this).parent().parent().parent().find('.block_active input').attr('disabled', 'disabled');
        //$(this).parent().parent().parent().find('.block_active').addClass('d-none');
        
      } else {
        $(this).parent().parent().parent().find('.block_active input').removeAttr('disabled');
        $(this).parent().parent().parent().find('.switch').removeAttr('disabled');
        $(this).parent().parent().parent().find('.block_freezed').addClass('d-none');
        //$(this).parent().parent().parent().find('.block_active').removeClass('d-none');
      }
    });
  }
  $(".option_selected_hotel").change(function(ev) {
    const data = {
      id: $(this).data("id"),
      subscriber_id: $(this).data("subscriber_id"),
      hotel: $(this).val()
    }
    
    $.ajax({
      url: "/admin/api/subscriptionupdate",
      method: "post",
      data: data
    }).done(function(res) {
      console.log(res);
    });
  });
  $(".option_selected_hotel_room").blur(function(ev) {
    const data = {
      id: $(this).data("id"),
      subscriber_id: $(this).data("subscriber_id"),
      hotel_room: $(this).val()
    }
    $.ajax({
      url: "/admin/api/subscriptionupdate",
      method: "post",
      data: data
    }).done(function(res) {
      //console.log(res);
    });
  });
  $(".option_wepay").change(function(ev) {
    const data = {
      id: $(this).data("id"),
      subscriber_id: $(this).data("subscriber_id"),
      wepay: $(this).prop('checked')
    }
    $.ajax({
      url: "/admin/api/subscriptionupdate",
      method: "post",
      data: data
    }).done(function(res) {
      //console.log(res);
    });
  });
  $(".edit-price").on('click', function(ev) {
    ev.preventDefault();
    const id = $(this).data("program");
    $('#modalEdit .content').html("Loading data...");
    $('#modalEdit .alert-danger').addClass('d-none');
    $('#modalEdit .alert-success').addClass('d-none');
    $('#modalEdit').modal();
    $.ajax({
      url: "/admin/api/editsubscriptionprice",
      method: "post",
      data: {id:id}
    }).done(function(data) {
      $('#modalEdit .content').html(data);
    });
  });
  $(".edit-cost").on('click', function(ev) {
    ev.preventDefault();
    const id = $(this).data("program");
    $('#modalEdit .content').html("Loading data...");
    $('#modalEdit .alert-danger').addClass('d-none');
    $('#modalEdit .alert-success').addClass('d-none');
    $('#modalEdit').modal();
    $.ajax({
      url: "/admin/api/editsubscriptioncost",
      method: "post",
      data: {id:id}
    }).done(function(data) {
      $('#modalEdit .content').html(data);
    });
  });
  $(".cancel-sub").on('click', function(ev) {
    var result = confirm("Want to delete?");
    if (result) {
      const id = $(this).data("id");
      $.ajax({
        url: "/admin/api/cancelsubscription",
        method: "post",
        data: {id:id}
      }).done(function(data) {
        $("#sub"+id).remove();
      });
    } 
  });
  $(".change-status").on('click', function(ev) {
    var result = confirm("Want to change status?");
    if (result) {
      const id = $(this).data("id");
      const status = $(this).data("status");
      $.ajax({
        url: "/admin/api/subscriptionupdate",
        method: "post",
        data: {id:id, status:status}
      }).done(function(res) {
        if (res.error) {
          alert("Some error occurred: "+res.msg);
        }  
        console.log(res);
      });
    } 
  });
  $(".confirm-sub").on('click', function(ev) {
    var result = confirm("Want to confirm your subscription?");
    if (result) {
      const id = $(this).data("id");
      const status = $(this).data("status");
      $.ajax({
        url: "/admin/api/subscriptionupdate",
        method: "post",
        data: {id:id, status:status}
      }).done(function(data) {
        //console.log("#"+id);
      });
    } 
  });

// PARTNERS
  $( ".partners .connectedSortable" ).sortable({
    remove: function( e, ui ) {
      var partnerships = [];
      var connectedSortable = $(".connectedSortable").parent();
      for (var a=1;a<connectedSortable.length;a++) {
        var partnership = {};
        $(connectedSortable[a]).serializeArray().map(n => {
          if (n['name']=="users") {
            if (!partnership[n['name']]) partnership[n['name']] = []
            partnership[n['name']].push(n['value']);
    
          } else {
            partnership[n['name']] = n['value'];
          }
        });
        if (partnership.users && partnership.users.length) partnerships.push(partnership);
      }
      var data = {
        category: ui.item.parent().parent().find("input[name='category']").val(),
        partner: ui.item.find("input[name='users']").val(),
        event: event,
        partnerships:partnerships
      }
      $.ajax({
        url: "/admin/api/partnershipsupdate",
        method: "post",
        data: data
      }).done(function(data) {
        //console.log("#");
      });
    },
    connectWith: ".connectedSortable"
  }).disableSelection();

// PROGRAM
$( ".program .connectedSortable" ).sortable({
  update: function( e, ui ) {
    var data = [];
    var tobescheduled = [];
    var connectedSortable = $(".connectedSortable").parent();
    for (var a=1;a<connectedSortable.length;a++) {
      var day = $(connectedSortable[a]).serializeJSON();
      day.room = JSON.parse(day.room);
      if (day.program && day.program.length) {
        var boxes = $(connectedSortable[a]).find("li");
        var timing = new Date (day.room.starttime).getTime();
        for (var b=0;b<day.program.length;b++) {
          day.program[b] = JSON.parse(day.program[b]);
          if (day.room.venue.breakduration>-1) timing+= b > 0 ? (parseFloat(day.room.venue.breakduration)*(60*1000)) : 0;
          var start = new Date (timing);
          if (parseFloat(day.program[b].performance.duration)>500 && day.program[b].performance.type.name=="Workshop") {
            day.program[b].performance.duration = parseFloat(day.program[b].performance.duration)/4;
          }
          if (day.room.venue.breakduration>-1) {
            timing+=(parseFloat(day.program[b].performance.duration)*(60*1000));
            var end = new Date (timing);
          } else {
            var end = new Date (timing+(parseFloat(day.program[b].performance.duration)*(60*1000)));
          }
          if (!$(boxes[b]).hasClass("disabled")) {
            console.log("disabled");
            var price = day.program[b].schedule && day.program[b].schedule.price ? day.program[b].schedule.price : undefined;
            var alleventschedulewithoneprice = day.program[b].schedule && day.program[b].schedule.alleventschedulewithoneprice ? day.program[b].schedule.alleventschedulewithoneprice : undefined;
            var priceincludesothershows = day.program[b].schedule && day.program[b].schedule.priceincludesothershows ? day.program[b].schedule.priceincludesothershows : undefined;
            console.log(day.program[b].schedule);
            day.program[b].schedule = [{
              starttime: start.toISOString(),
              endtime: end.toISOString(),
              price: price,
              alleventschedulewithoneprice: alleventschedulewithoneprice,
              priceincludesothershows: priceincludesothershows,
              venue: day.room.venue
            }];
            console.log(day.program[b].schedule);
            $(boxes[b]).find(".timing").html(moment(start).utc().format("H:mm")+" - "+moment(end).utc().format("H:mm"));
            $(boxes[b]).find(".index").html(b+1);
          } else {
            day.program[b].schedule = [day.program[b].schedule]
          }
          //console.log(day.program[b]);
          data.push({_id: day.program[b]._id, schedule: day.program[b].schedule, performance: day.program[b].performance._id, event: day.program[b].event});
        }
      }
      //
    }
    var day = $(connectedSortable[0]).serializeJSON();
    var boxes = $(connectedSortable[0]).find("li");
    if (day.program && day.program.length) {
      for (var b=0;b<day.program.length;b++) {
        $(boxes[b]).find(".timing").html("");
        $(boxes[b]).find(".index").html(b+1);
        day.program[b] = JSON.parse(day.program[b]);
        tobescheduled.push({_id: day.program[b]._id, schedule: [], performance: day.program[b].performance._id, event: day.program[b].event});
      }
    }
    $.ajax({
      url: "/admin/api/programupdate",
      method: "post",
      data: {data: data, tobescheduled: tobescheduled, event: day.event}
    }).done(function(data) {
      //console.log(data);
    });
  },
  connectWith: ".connectedSortable"
}).disableSelection();
var current;
$( ".edit-schedule" ).click(function( event ) {
  current = $(this).parent().parent().find("input");
  var schedule = JSON.parse(current.val()).schedule;
  //console.log(schedule);
  //console.log(schedule.starttime);
  //console.log(schedule.endtime);
  //console.log(new Date(schedule.starttime).getUTCHours());
  //console.log(new Date(schedule.starttime).getUTCMinutes());
  //console.log(new Date(schedule.endtime).getUTCHours());
  //console.log(new Date(schedule.endtime).getUTCMinutes());
  //const id = $(this).data("program");
  $('#modalEditSchedule .starttime_hours').val(new Date(schedule.starttime).getUTCHours())
  $('#modalEditSchedule .starttime_minutes').val(new Date(schedule.starttime).getUTCMinutes())
  $('#modalEditSchedule .endtime_hours').val(new Date(schedule.endtime).getUTCHours())
  $('#modalEditSchedule .endtime_minutes').val(new Date(schedule.endtime).getUTCMinutes())

//$('#modalEditSchedule .endtime').html("Loading data...");
  //$('#modalEditSchedule .alert-danger').addClass('d-none');
  //$('#modalEditSchedule .alert-success').addClass('d-none');
  $('#modalEditSchedule').modal();
});
$( "#modalEditSchedule form" ).submit(function( event ) {
  event.preventDefault();
  var formdata = getFormData($( this ));
  var currentObj = JSON.parse(current.val());
  currentObj.schedule.starttime = new Date(Date.UTC(
    parseFloat(formdata.startday.split("-")[0]),
    parseFloat(formdata.startday.split("-")[1])-1,
    parseFloat(formdata.startday.split("-")[2]),
    parseFloat(formdata.starttime_hours),
    parseFloat(formdata.starttime_minutes)
  ));
  currentObj.schedule.endtime = new Date(Date.UTC(
    parseFloat(formdata.endday.split("-")[0]),
    parseFloat(formdata.endday.split("-")[1])-1,
    parseFloat(formdata.endday.split("-")[2]),
    parseFloat(formdata.endtime_hours),
    parseFloat(formdata.endtime_minutes)
  ));
/*   currentObj.schedule.starttime = new Date(currentObj.schedule.starttime);
  currentObj.schedule.starttime.setUTCYear(formdata.startday.split("-")[0]);
  currentObj.schedule.starttime.setUTCMonth(parseFloat(formdata.startday.split("-")[1])-1);
  currentObj.schedule.starttime.setUTCDate(parseFloat(formdata.startday.split("-")[2]));
  currentObj.schedule.starttime.setUTCHours(formdata.starttime_hours);
  currentObj.schedule.starttime.setUTCMinutes(formdata.starttime_minutes);
  currentObj.schedule.endtime = new Date(currentObj.schedule.endtime)
  currentObj.schedule.endtime.setUTCYear(formdata.endday.split("-")[0]);
  currentObj.schedule.endtime.setUTCMonth(parseFloat(formdata.endday.split("-")[1])-1);
  currentObj.schedule.endtime.setUTCDate(parseFloat(formdata.endday.split("-")[2]));
  currentObj.schedule.endtime.setUTCHours(formdata.endtime_hours);
  currentObj.schedule.endtime.setUTCMinutes(formdata.endtime_minutes);
 */  var timestr = "";
  timestr+= ("0"+formdata.starttime_hours).substr(-2)+":"+("0"+formdata.starttime_minutes).substr(-2);
  timestr+= " - ";
  timestr+= ("0"+formdata.endtime_hours).substr(-2)+":"+("0"+formdata.endtime_minutes).substr(-2);
  //console.log(formdata);
  //console.log(currentObj.schedule);
  //console.log(currentObj.schedule.starttime);
  //console.log(currentObj.schedule.endtime);
  //console.log(new Date(currentObj.schedule.starttime).getUTCHours());
  //console.log(new Date(currentObj.schedule.starttime).getUTCMinutes());
  //console.log(new Date(currentObj.schedule.endtime).getUTCHours());
  //console.log(new Date(currentObj.schedule.endtime).getUTCMinutes());
  //console.log((current.val()));
  current.val(JSON.stringify(currentObj));
  $(current.parent().parent().find(".timing")).html(timestr);
  $(current.parent().parent()).addClass("disabled");
  //console.log((current.val()));
  programSortableUpdate();
  //const id = $(this).data("program");
  /*$('#modalEditSchedule .starttime-hours').val(new Date(schedule.starttime).getUTCHours())
  $('#modalEditSchedule .starttime-minutes').val(new Date(schedule.starttime).getUTCMinutes())
  $('#modalEditSchedule .endtime-hours').val(new Date(schedule.endtime).getUTCHours())
  $('#modalEditSchedule .endtime-minutes').val(new Date(schedule.endtime).getUTCMinutes())*/
});
function programSortableUpdate() {
  var data = [];
  var tobescheduled = [];
  var connectedSortable = $(".connectedSortable").parent();
  for (var a=1;a<connectedSortable.length;a++) {
    var day = $(connectedSortable[a]).serializeJSON();
    day.room = JSON.parse(day.room);
    if (day.program && day.program.length) {
      var boxes = $(connectedSortable[a]).find("li");
      var timing = new Date (day.room.starttime).getTime();
      for (var b=0;b<day.program.length;b++) {
        day.program[b] = JSON.parse(day.program[b]);
        if (day.room.venue.breakduration>-1) timing+= b > 0 ? (parseFloat(day.room.venue.breakduration)*(60*1000)) : 0;
        var start = new Date (timing);
        if (parseFloat(day.program[b].performance.duration)>500 && day.program[b].performance.type.name=="Workshop") {
          day.program[b].performance.duration = parseFloat(day.program[b].performance.duration)/4;
        }
        if (day.room.venue.breakduration>-1) {
          timing+=(parseFloat(day.program[b].performance.duration)*(60*1000));
          var end = new Date (timing);
        } else {
          var end = new Date (timing+(parseFloat(day.program[b].performance.duration)*(60*1000)));
        }
        if (!$(boxes[b]).hasClass("disabled")) {
          day.program[b].schedule = [{
            starttime: start.toISOString(),
            endtime: end.toISOString(),
            venue: day.room.venue
          }];
          $(boxes[b]).find(".timing").html(moment(start).utc().format("H:mm")+" - "+moment(end).utc().format("H:mm"));
          $(boxes[b]).find(".index").html(b+1);
        } else {
          day.program[b].schedule.disableautoschedule = true;
          day.program[b].schedule = [day.program[b].schedule]
          //console.log("disabled");
        }
        //console.log(day.program[b]);
        data.push({_id: day.program[b]._id, schedule: day.program[b].schedule, performance: day.program[b].performance._id, event: day.program[b].event});
      }
    }
    //
  }
  var day = $(connectedSortable[0]).serializeJSON();
  var boxes = $(connectedSortable[0]).find("li");
  if (day.program && day.program.length) {
    for (var b=0;b<day.program.length;b++) {
      $(boxes[b]).find(".timing").html("");
      $(boxes[b]).find(".index").html(b+1);
      day.program[b] = JSON.parse(day.program[b]);
      tobescheduled.push({_id: day.program[b]._id, schedule: [], performance: day.program[b].performance._id, event: day.program[b].event});
    }
  }
  //console.log("pre ajax");
  $.ajax({
    url: "/admin/api/programupdate",
    method: "post",
    data: {data: data, tobescheduled: tobescheduled, event: day.event}
  }).done(function(data) {
    //console.log(data);
  });
}
function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

  $('#modalAddContact').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    $('#modalAddContact form')[0].reset();
    $( "#modalAddContact input[name='type'][type='checkbox']").removeAttr("checked");
    var id = button.data('id') // Extract info from data-* attributes
    var stagename = button.data('stagename') // Extract info from data-* attributes
    var item = button.data('item') // Extract info from data-* attributes
    var index = button.data('index') // Extract info from data-* attributes
    console.log(item);
    for (i in item) {
      console.log(i+": "+item[i]);
      console.log(i+": "+item[i]);
      if ($( "#modalAddContact input[name='"+ i +"'][type='text']" ).length) $( "#modalAddContact input[name='"+ i +"']" ).val( item[i] );
      if ($( "#modalAddContact select[name='"+ i +"']" ).length) $( "#modalAddContact select[name='"+ i +"']" ).val( item[i] );
    }
    $( "#modalAddContact input[name='type'][type='checkbox']" ).each((index)=>{
      if (item.types && item.types.indexOf($( $( "#modalAddContact input[name='type'][type='checkbox']" )[index] ).attr("value"))!==-1) {
        $( $( "#modalAddContact input[name='type'][type='checkbox']" )[index] ).attr("checked", "checked");
      } 
    });
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('Contact for ' + stagename);
    modal.find('.modal-id').val(id);
    modal.find('.modal-index').val(index);
    modal.find('.modal-stagename').val(stagename);
  });
  
  $( "#modalAddContact form" ).submit(function( event ) {
    event.preventDefault();
    var post = {};
    $( this ).serializeArray().map(n => {
      if (n['name']=="type") {
        post[n['name']] = n['value'].trim();

      } else {
        post[n['name']] = n['value'].trim();
      }
    });
    $.ajax({
      url: "/admin/api/partners/contacts/add/",
      method: "post",
      data: post
    }).done(function(data) {
      if (post.index!="") {
        var index = post.index;
      } else {
        var index = $("#"+post.crew+" .contacts").children().length;
      }
      var str = $('<div><a href="#" data-toggle="modal" data-target="#modalAddContact" data-id="'+post.crew+'" data-stagename="'+post.stagename+'" data-item="'+JSON.stringify(post)+'" data-index="'+index+'"><span data-toggle="tooltip" data-placement="top" title="Edit"><i class="fas fa-edit"></i></span></a> <a class="text-danger deleteContact" href="#" data-id="'+post.crew+'" data-stagename="'+post.stagename+'" data-index="'+index+'"><span data-toggle="tooltip" data-placement="top" title="Delete"><i class="fas fa-trash-alt"></i></span></a> | <a href="mailto:'+post.stagename+'" target="_blank">'+post.name+' '+post.surname+' &lt;'+post.email+'&gt;</a></div>');
      var str2 = $(str.find("a")[0]).attr("data-item", JSON.stringify(post));
      if (post.index!="") {
        $($("#"+post.crew+" .contacts").children()[post.index]).html($(str).prepend(str2))
      } else {
        var index = $("#"+post.crew+" .contacts").children().length;
        $("#"+post.crew+" .contacts").append($(str).prepend(str2));
      }
      $( ".deleteContact" ).on('click', function( event ) {
        deleteContact( $(this), event );
      });    
      $('#modalAddContact').modal('hide');
    });
  });
  
  $( ".deleteContact" ).on('click', function( event ) {
    var result = confirm("Want to delete this contact?");
    if (result) {
      deleteContact( $(this), event );
    }
  });
  
  deleteContact = (button, event ) => {
    console.log("deleteContact");
    event.preventDefault();
    var post = {};
    post.id = button.data('id') // Extract info from data-* attributes
    post.index = button.data('index') // Extract info from data-* attributes
    post.stagename = button.data('stagename') // Extract info from data-* attributes
    var ul = button.parent().parent();

    $.ajax({
      url: "/admin/api/partners/contacts/delete/",
      method: "post",
      data: post
    }).done(function(data) {
      button.parent().remove();
      ul.find("li").each((index, item) => {
        $(item).find("a").each((i, a) => {
          $(a).attr("data-index", index);
        });
      });
    });
  }
  
  $( ".duplicate" ).click(function( event ) {
    $(this).parent().parent().clone().insertAfter($(this).parent().parent())
  });

  if ($(".multiple-select").length) $(".multiple-select").bsMultiSelect({  placeholder:'Room'});

  $( ".lock-schedule" ).click(function( event ) {
    var box = $(this).parent().parent();
    if($(this).parent().parent().hasClass("disabled")){
      $(this).find("i").removeClass("fa-lock")
      $(this).find("i").addClass("fa-lock-open")
      $(this).parent().parent().removeClass("disabled")
    } else {
      $(this).find("i").removeClass("fa-lock-open")
      $(this).find("i").addClass("fa-lock")
      $(this).parent().parent().addClass("disabled")
    }
    console.log($(this).parent().parent());
  });

  $( ".unlink" ).click(function( event ) {
    var row = $(this).parent().parent();
    var result = confirm("Want to unlink this partner?");
    if (result) {
      event.preventDefault();
      const owner = $(this).data("owner");
      const partner = $(this).data("partner");
      $.ajax({
        url: "/admin/api/partner/unlink/",
        method: "post",
        data: {id:partner, owner:owner}
      }).done(function(data) {
        row.remove();
      });
    }
  });
  
  $('#modalAddPartner').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes
    var stagename = button.data('stagename') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    // modal.find('.modal-title').text('New partner for ' + stagename)
  })


  $( "#formPartnerLinkName" ).autocomplete({
    source: function( request, response ) {
      $.ajax( {
        url: "/admin/api/getauthors/"+request.term,
        success: function( data ) {
          var dd = data.map(item=>{return {value:item.stagename, id: item.id}}) ;
          response(dd );
        }
      } );
    },
    select: function( event, ui ) {
      $("input[name='id']").val(ui.item.id);
    }
  });

  $( "#modalLinkPartner form" ).submit(function( event ) {
    event.preventDefault();
    var post = {};
    $( this ).serializeArray().map(n => {
      post[n['name']] = n['value'].trim();
    });
    $.ajax({
      url: "/admin/api/partner/link/",
      method: "post",
      data: post
    })
    .done(function(data) {
      $( this ).find(".alert").html("SAVED!!!").removeClass("d-none").removeClass("alert-danger").addClass("alert-success");
    })
    .fail(function(err) {
      $( "#modalLinkPartner form" ).find(".alert").html(err.responseJSON.message).removeClass("d-none").removeClass("alert-success").addClass("alert-danger");
    });
})
  $( "#modalAddPartner form" ).submit(function( event ) {
    event.preventDefault();
    var post = {};
    $( this ).serializeArray().map(n => {
      if (n['name']=="web" || n['name']=="social") {
        var urls = n['value'].split(/\n/);
        post[n['name']] = [];
        for (url in urls) post[n['name']].push({url:urls[url].trim()});
      } else {
        post[n['name']] = n['value'].trim();
      }
    });
    post.is_public = false;
    post.is_crew = true;
    post.is_partner = true;
    post.organizationData = {delegate: post.delegate};
    post.partner_owner = [{owner: post.partner_owner}];
    delete post.delegate;
    post.slug = slugify(post.stagename);
    $.ajax({
      url: "/admin/api/partner/new/",
      method: "post",
      data: post
    })
    .done(function(data) {
      $( this ).find(".alert").html("SAVED!!!").removeClass("d-none").removeClass("alert-danger").addClass("alert-success");
    })
    .fail(function(err) {
      $( "#modalAddPartner form" ).find(".alert").html(err.responseJSON.message).removeClass("d-none").removeClass("alert-success").addClass("alert-danger");
    });

  });
});

const slugify = (str) => {
  str = String(str).toString();
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const swaps = {
      '0': ['°', '₀', '۰', '０'],
      '1': ['¹', '₁', '۱', '１'],
      '2': ['²', '₂', '۲', '２'],
      '3': ['³', '₃', '۳', '３'],
      '4': ['⁴', '₄', '۴', '٤', '４'],
      '5': ['⁵', '₅', '۵', '٥', '５'],
      '6': ['⁶', '₆', '۶', '٦', '６'],
      '7': ['⁷', '₇', '۷', '７'],
      '8': ['⁸', '₈', '۸', '８'],
      '9': ['⁹', '₉', '۹', '９'],
      'a': ['à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'ā', 'ą', 'å', 'α', 'ά', 'ἀ', 'ἁ', 'ἂ', 'ἃ', 'ἄ', 'ἅ', 'ἆ', 'ἇ', 'ᾀ', 'ᾁ', 'ᾂ', 'ᾃ', 'ᾄ', 'ᾅ', 'ᾆ', 'ᾇ', 'ὰ', 'ά', 'ᾰ', 'ᾱ', 'ᾲ', 'ᾳ', 'ᾴ', 'ᾶ', 'ᾷ', 'а', 'أ', 'အ', 'ာ', 'ါ', 'ǻ', 'ǎ', 'ª', 'ა', 'अ', 'ا', 'ａ', 'ä'],
      'b': ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
      'c': ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
      'd': ['ď', 'ð', 'đ', 'ƌ', 'ȡ', 'ɖ', 'ɗ', 'ᵭ', 'ᶁ', 'ᶑ', 'д', 'δ', 'د', 'ض', 'ဍ', 'ဒ', 'დ', 'ｄ'],
      'e': ['é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ', 'ë', 'ē', 'ę', 'ě', 'ĕ', 'ė', 'ε', 'έ', 'ἐ', 'ἑ', 'ἒ', 'ἓ', 'ἔ', 'ἕ', 'ὲ', 'έ', 'е', 'ё', 'э', 'є', 'ə', 'ဧ', 'ေ', 'ဲ', 'ე', 'ए', 'إ', 'ئ', 'ｅ'],
      'f': ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
      'g': ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
      'h': ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
      'i': ['í', 'ì', 'ỉ', 'ĩ', 'ị', 'î', 'ï', 'ī', 'ĭ', 'į', 'ı', 'ι', 'ί', 'ϊ', 'ΐ', 'ἰ', 'ἱ', 'ἲ', 'ἳ', 'ἴ', 'ἵ', 'ἶ', 'ἷ', 'ὶ', 'ί', 'ῐ', 'ῑ', 'ῒ', 'ΐ', 'ῖ', 'ῗ', 'і', 'ї', 'и', 'ဣ', 'ိ', 'ီ', 'ည်', 'ǐ', 'ი', 'इ', 'ی', 'ｉ'],
      'j': ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
      'k': ['ķ', 'ĸ', 'к', 'κ', 'Ķ', 'ق', 'ك', 'က', 'კ', 'ქ', 'ک', 'ｋ'],
      'l': ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
      'm': ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
      'n': ['ñ', 'ń', 'ň', 'ņ', 'ŉ', 'ŋ', 'ν', 'н', 'ن', 'န', 'ნ', 'ｎ'],
      'o': ['ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'ø', 'ō', 'ő', 'ŏ', 'ο', 'ὀ', 'ὁ', 'ὂ', 'ὃ', 'ὄ', 'ὅ', 'ὸ', 'ό', 'о', 'و', 'θ', 'ို', 'ǒ', 'ǿ', 'º', 'ო', 'ओ', 'ｏ', 'ö'],
      'p': ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
      'q': ['ყ', 'ｑ'],
      'r': ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
      's': ['ś', 'š', 'ş', 'с', 'σ', 'ș', 'ς', 'س', 'ص', 'စ', 'ſ', 'ს', 'ｓ'],
      't': ['ť', 'ţ', 'т', 'τ', 'ț', 'ت', 'ط', 'ဋ', 'တ', 'ŧ', 'თ', 'ტ', 'ｔ'],
      'u': ['ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự', 'û', 'ū', 'ů', 'ű', 'ŭ', 'ų', 'µ', 'у', 'ဉ', 'ု', 'ူ', 'ǔ', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'უ', 'उ', 'ｕ', 'ў', 'ü'],
      'v': ['в', 'ვ', 'ϐ', 'ｖ'],
      'w': ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
      'x': ['χ', 'ξ', 'ｘ'],
      'y': ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', 'ÿ', 'ŷ', 'й', 'ы', 'υ', 'ϋ', 'ύ', 'ΰ', 'ي', 'ယ', 'ｙ'],
      'z': ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
      'aa': ['ع', 'आ', 'آ'],
      'ae': ['æ', 'ǽ'],
      'ai': ['ऐ'],
      'ch': ['ч', 'ჩ', 'ჭ', 'چ'],
      'dj': ['ђ', 'đ'],
      'dz': ['џ', 'ძ'],
      'ei': ['ऍ'],
      'gh': ['غ', 'ღ'],
      'ii': ['ई'],
      'ij': ['ĳ'],
      'kh': ['х', 'خ', 'ხ'],
      'lj': ['љ'],
      'nj': ['њ'],
      'oe': ['ö', 'œ', 'ؤ'],
      'oi': ['ऑ'],
      'oii': ['ऒ'],
      'ps': ['ψ'],
      'sh': ['ш', 'შ', 'ش'],
      'shch': ['щ'],
      'ss': ['ß'],
      'sx': ['ŝ'],
      'th': ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
      'ts': ['ц', 'ც', 'წ'],
      'ue': ['ü'],
      'uu': ['ऊ'],
      'ya': ['я'],
      'yu': ['ю'],
      'zh': ['ж', 'ჟ', 'ژ'],
      '(c)': ['©'],
      'A': ['Á', 'À', 'Ả', 'Ã', 'Ạ', 'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Å', 'Ā', 'Ą', 'Α', 'Ά', 'Ἀ', 'Ἁ', 'Ἂ', 'Ἃ', 'Ἄ', 'Ἅ', 'Ἆ', 'Ἇ', 'ᾈ', 'ᾉ', 'ᾊ', 'ᾋ', 'ᾌ', 'ᾍ', 'ᾎ', 'ᾏ', 'Ᾰ', 'Ᾱ', 'Ὰ', 'Ά', 'ᾼ', 'А', 'Ǻ', 'Ǎ', 'Ａ', 'Ä'],
      'B': ['Б', 'Β', 'ब', 'Ｂ'],
      'C': ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
      'D': ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
      'E': ['É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ', 'Ë', 'Ē', 'Ę', 'Ě', 'Ĕ', 'Ė', 'Ε', 'Έ', 'Ἐ', 'Ἑ', 'Ἒ', 'Ἓ', 'Ἔ', 'Ἕ', 'Έ', 'Ὲ', 'Е', 'Ё', 'Э', 'Є', 'Ə', 'Ｅ'],
      'F': ['Ф', 'Φ', 'Ｆ'],
      'G': ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
      'H': ['Η', 'Ή', 'Ħ', 'Ｈ'],
      'I': ['Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị', 'Î', 'Ï', 'Ī', 'Ĭ', 'Į', 'İ', 'Ι', 'Ί', 'Ϊ', 'Ἰ', 'Ἱ', 'Ἳ', 'Ἴ', 'Ἵ', 'Ἶ', 'Ἷ', 'Ῐ', 'Ῑ', 'Ὶ', 'Ί', 'И', 'І', 'Ї', 'Ǐ', 'ϒ', 'Ｉ'],
      'J': ['Ｊ'],
      'K': ['К', 'Κ', 'Ｋ'],
      'L': ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
      'M': ['М', 'Μ', 'Ｍ'],
      'N': ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
      'O': ['Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'Ø', 'Ō', 'Ő', 'Ŏ', 'Ο', 'Ό', 'Ὀ', 'Ὁ', 'Ὂ', 'Ὃ', 'Ὄ', 'Ὅ', 'Ὸ', 'Ό', 'О', 'Θ', 'Ө', 'Ǒ', 'Ǿ', 'Ｏ', 'Ö'],
      'P': ['П', 'Π', 'Ｐ'],
      'Q': ['Ｑ'],
      'R': ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
      'S': ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
      'T': ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
      'U': ['Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự', 'Û', 'Ū', 'Ů', 'Ű', 'Ŭ', 'Ų', 'У', 'Ǔ', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ｕ', 'Ў', 'Ü'],
      'V': ['В', 'Ｖ'],
      'W': ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
      'X': ['Χ', 'Ξ', 'Ｘ'],
      'Y': ['Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'Ÿ', 'Ῠ', 'Ῡ', 'Ὺ', 'Ύ', 'Ы', 'Й', 'Υ', 'Ϋ', 'Ŷ', 'Ｙ'],
      'Z': ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
      'AE': ['Æ', 'Ǽ'],
      'Ch': ['Ч'],
      'Dj': ['Ђ'],
      'Dz': ['Џ'],
      'Gx': ['Ĝ'],
      'Hx': ['Ĥ'],
      'Ij': ['Ĳ'],
      'Jx': ['Ĵ'],
      'Kh': ['Х'],
      'Lj': ['Љ'],
      'Nj': ['Њ'],
      'Oe': ['Œ'],
      'Ps': ['Ψ'],
      'Sh': ['Ш'],
      'Shch': ['Щ'],
      'Ss': ['ẞ'],
      'Th': ['Þ'],
      'Ts': ['Ц'],
      'Ya': ['Я'],
      'Yu': ['Ю'],
      'Zh': ['Ж'],
  };

  Object.keys(swaps).forEach((swap) => {
      swaps[swap].forEach(s => {
          str = str.replace(new RegExp(s, "g"), swap);
      })
  });
  return str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .replace(/^-+/, "") // trim - from start of text
      .replace(/-+$/, "");
};
/* 
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function checkCookie() {
  var firsttime = getCookie("firsttime");
  if (!firsttime) {
    $('#msg_modal').modal({
      backdrop: true
    });
    setCookie("firsttime", true, 10);
  }
}

$("#liker").on('click', function(ev) {
  ///likes/?section=performances&id=5a9c32c3606624000000bccb
  ev.preventDefault();
  const $el = $("#liker");
  const $label = $("#liker .label_like_button");
  const $icon = $("#liker img");
  const $likes_count = $(".likes_count");
  const url = $el.attr('data-endpoint');
  const method = $el.attr('data-method');
  let payload = $el.attr('data-payload');
  if (payload) {
    payload = JSON.parse(payload);
  } else {
    payload = {};
  }

  request(url, method, payload, (data) => {
    if(data.err) {
      alert(data.msg);
    } else {
      if(data.status==="Unliked") {
        $label.html("Like");
        $likes_count.html(parseFloat($likes_count.html())-1);
        $el.attr("style","");
        $icon.attr("src","/images/like_icon.svg");
      } else {
        $label.html("Unlike");
        $likes_count.html(parseFloat($likes_count.html())+1);
        $el.attr("style","opacity: .65;");
        $icon.attr("src","/images/like_full_icon.svg");
      }
    }
  });
  //}
});

const request = (url, method, payload, cb) => {
  $.ajax({
    url: url,
    method: method,
    data: payload
  }).done(function(data) {
    cb(data);
    //window.location.reload();
  });
} */


function compare( a, b ) {
  if ( a.unread < b.unread ){
    return 1;
  }
  if ( a.unread > b.unread ){
    return -1;
  }
  return 0;
}
function compare2( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}
$(document).ready(function() {
  if (document.getElementById("jsapp") !== null) {
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
      FB.init({
        appId: '1243968378972425',
        version: 'v2.7' // or v2.1, v2.2, v2.3, ...
      });
      FB.getLoginStatus(function(response) {
        console.log(response);
        if (response.status == "connected") {
          getPagesAdmin();
        } else {
          FB.login(function(response) {
            console.log(response);
            getPagesAdmin();
            //getGroupsList();
          }, {scope: "user_likes, manage_pages, pages_show_list, groups_access_member_info, public_profile"});    
        }
      });
      getPagesAdmin = () => {
        FB.api(
          '/me/',
          'GET',
          {
            "fields":"name, id"
          },
          function(responseme) {
            FB.api(
              '/me/accounts',
              'GET',
              {
                "fields":"name, id"
              },
              function(response) {
                console.log(response);
                response.data.sort(compare2);
                response.data.unshift(responseme);
                var str = "";
                response.data.forEach((item, index)=>{
                  //if (exclude.indexOf(item.id)===-1)
                  str+= "<option value=\""+item.id+"\">"+item.name+"</option>";
                });
                $("#getFBdataSelect").html(str);
                $("#getFBdataSelect").removeClass("d-none");
                $("#getFBdataButton").removeClass("disabled");
                $("#getFBlikesButton").removeClass("d-none");
                $("#getFBdataButton span").html("GET GROUPS");
                $("#getFBdataButton i").addClass("d-none");
                
                $("#getFBdataButton").click(()=>{
                  $("#getFBdataSelect").addClass("disabled");
                  $("#getFBdataButton").addClass("disabled");
                  $("#getFBlikesButton").addClass("disabled");
                  $("#getFBdataButton span").html("Loading data from Facebook... ");
                  $("#jsapp").html("");
                  $("#getFBdataButton i").removeClass("d-none");
                  getGroupsList();
                });
                $("#getFBlikesButton").click(()=>{
                  $("#getFBdataSelect").addClass("disabled");
                  $("#getFBdataButton").addClass("disabled");
                  $("#getFBlikesButton").addClass("disabled");
                  $("#getFBlikesButton span").html("Loading data from Facebook... ");
                  $("#jsapp").html("");
                  $("#getFBlikesButton i").removeClass("d-none");
                  getLikesList();
                });
                // Insert your code here
              }
            );
              }
        );

      }
      getGroupsList = () => {
        var exclude = ["34376839294", "299501700095931", "116158998423127","107212959298488","1490734744584748","306412316732636","1634755746809965","165987733448047","676217712457353", "405151636188219"];
        FB.api(
          '/'+$("#getFBdataSelect").val()+'/groups',
          'GET',
          {
            "fields":"name,unread,description,picture{url}", /* "can_post,best_page,name,link,fan_count,talking_about_count,about,description,picture{url}" */
            "limit":"10000"
          },
          function(response) {
            console.log(response);
            var str = "";
            if (response.data && response.data.length) {
              response.data.sort(compare2);
              str = "<table class=\"table\">";
              str+= "<thead><tr><td>N</td><td>Name</td><td>URL</td><td>Unread</td></tr></thead><tbody>";
              response.data.forEach((item, index)=>{
                if (exclude.indexOf(item.id)===-1) str+= "<tr><td>"+index+"</td><td>"+item.name+"</td><td><a href=\"https://www.facebook.com/groups/"+item.id+"/\" target=\"_blank\">"+item.id+"<a></td><td>"+item.unread+"</td></tr>";
              });
              str+= "</tbody></table>";
            } else {
              str = "<div class=\"alert alert-danger\">ERROR</div>";
            }
            $("#jsapp").html(str);
            $("#getFBdataSelect").removeClass("disabled");
            $("#getFBdataButton").removeClass("disabled");
            $("#getFBlikesButton").removeClass("disabled");
            $("#getFBdataButton span").html("GET GROUPS");
            $("#getFBdataButton i").addClass("d-none");
          }
        );
      }
      getLikesList = () => {
        var exclude = ["34376839294"];
        FB.api(
          '/'+$("#getFBdataSelect").val()+'/likes',
          'GET',
          {
            "fields":"name,can_post,best_page,link,fan_count,talking_about_count,about,description,picture{url}",
            "limit":"10000"
          },
          function(response) {
            console.log(response);
            var str = "";
            if (response.data && response.data.length) {
              response.data.sort(compare2);
              str = "<table class=\"table\">";
              str+= "<thead><tr><td>N</td><td>Name</td><td>URL</td><td>Can post</td></tr></thead><tbody>";
              response.data.forEach((item, index)=>{
                if (exclude.indexOf(item.id)===-1) str+= "<tr><td>"+index+"</td><td>"+item.name+"</td><td><a href=\""+item.link+"/\" target=\"_blank\">"+item.link+"<a></td><td>"+item.can_post+"</td></tr>";
              });
              str+= "</tbody></table>";
            } else {
              str = "ERROR";
            }
            $("#jsapp").html(str);
            $("#getFBdataSelect").removeClass("disabled");
            $("#getFBdataButton").removeClass("disabled");
            $("#getFBlikesButton").removeClass("disabled");
            $("#getFBlikesButton span").html("GET LIKES");
            $("#getFBlikesButton i").addClass("d-none");
          }
        );
      }
    });

  }
});
