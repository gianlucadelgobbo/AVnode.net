$(function() {
  $(".cancel-sub").on('click', function(ev) {
    var result = confirm("Want to delete?");
    if (result) {
      const id = $(this).data("id");
      console.log($(this).data("id"));
      $.ajax({
        url: "/admin/api/cancelsubscription",
        method: "post",
        data: {id:id}
      }).done(function(data) {
        console.log("#"+id);
        $("#sub"+id).remove();
      });
    } 
  });
  $(".change-status").on('click', function(ev) {
    var result = confirm("Want to change status?");
    if (result) {
      const id = $(this).data("id");
      const status = $(this).data("status");
      console.log({id:id, status:status});
      $.ajax({
        url: "/admin/api/subscriptionupdate",
        method: "post",
        data: {id:id, status:status}
      }).done(function(data) {
        console.log("#"+id);
      });
    } 
  });
  $(".confirm-sub").on('click', function(ev) {
    var result = confirm("Want to confirm your subscription?");
    if (result) {
      const id = $(this).data("id");
      const status = $(this).data("status");
      console.log({id:id, status:status});
      $.ajax({
        url: "/admin/api/subscriptionupdate",
        method: "post",
        data: {id:id, status:status}
      }).done(function(data) {
        console.log("#"+id);
      });
    } 
  });
});
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