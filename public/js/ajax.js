$("#liker").on('click', function(ev) {
  ///likes/?section=performances&id=5a9c32c3606624000000bccb
  ev.preventDefault();
  const $el = $("#liker");
  const $label = $("#liker .label_like_button");
  const $icon = $("#liker img");
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
    console.log(data);
    if(data.err) {
      alert(data.msg);
    } else {
      if(data.status==="Unliked") {
        $label.html("Like");
        $el.attr("style","")
        $icon.attr("src","/images/like_icon.svg")
      } else {
        $label.html("Unlike");
        $el.attr("style","opacity: .65;")
        $icon.attr("src","/images/like_full_icon.svg")
      }
    }
  });
  //}
});

const request = (url, method, payload, cb) => {
  console.log(url);
  console.log(method);
  console.log(payload);
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