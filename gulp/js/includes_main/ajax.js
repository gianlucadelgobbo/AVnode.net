$(function() {
  checkCookie()
});
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
  var firsttime = getCookie("firsttime2");
  if (!firsttime) {
    $('#msg_modal').modal({
      backdrop: true
    });
    setCookie("firsttime2", true, 10);
  }
}

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

$("#liker").on('click', function(ev) {
  ///likes/?section=performances&id=5a9c32c3606624000000bccb
  ev.preventDefault();
  liker()
});
var liker = () => {
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
  /* const confirm = $el.attr('data-confirm');
  if (confirm) {
    bootbox.confirm({
      size: 'small',
      message: 'Are you sure?',
      closeButton: false,
      callback: function(result) {
        if (result) {
          request(url, method, payload);
        }
      }
    });
  } else {
   */
  request(url, method, payload, (data) => {
    //boxPerformerEvent(data);
    if(data.err) {
      var r = confirm(data.msg);
      if (r == true) {
        window.location.href = "/login?returnTo="+window.location.href;
      }
    } else {
      if(data.status==="Unliked") {
        $label.html("Like");
        $likes_count.html(parseFloat($likes_count.html())-1);
        $el.attr("style","");
        $icon.attr("src","/images/icon_like.svg");
      } else {
        $label.html("Unlike");
        $likes_count.html(parseFloat($likes_count.html())+1);
        $el.attr("style","opacity: .65;");
        $icon.attr("src","/images/like_full_icon.svg");
      }
    }
  });
  //}
}

const request = (url, method, payload, cb) => {
  $.ajax({
    url: url,
    method: method,
    data: payload
  }).done(function(data) {
    cb(data);
    //window.location.reload();
  });
}
/* 
$(document).on('click', '.ajax', function(ev) {
  ev.preventDefault();
  const $el = $(this);
  const url = $el.attr('data-endpoint');
  const method = $el.attr('data-method');
  let payload = $el.attr('data-payload');
  if (payload) {
    payload = JSON.parse(payload);
  } else {
    payload = {};
  }
  const confirm = $el.attr('data-confirm');
  if (confirm) {
    bootbox.confirm({
      size: 'small',
      message: 'Are you sure?',
      closeButton: false,
      callback: function(result) {
        if (result) {
          request(url, method, payload);
        }
      }
    });
  } else {
    request(url, method, payload);
  }
});
 */