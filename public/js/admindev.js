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

// PARTNERS
  $( "#sortable0, #sortable1, #sortable2, #sortable3, #sortable4, #sortable5, #sortable6, #sortable7, #sortable8, #sortable9, #sortable10, #sortable11" ).sortable({
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
      console.log("category: "+data.category);
      console.log("partner: "+data.partner);
      console.log("event: "+data.event);
      console.log("event partnerships: ");
      console.log(data.partnerships);
      $.ajax({
        url: "/admin/api/partnershipsupdate",
        method: "post",
        data: data
      }).done(function(data) {
        console.log("#");
      });
    },
    connectWith: ".connectedSortable"
  }).disableSelection();

  $('#modalAddContact').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var id = button.data('id') // Extract info from data-* attributes
    var stagename = button.data('stagename') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New contact for ' + stagename)
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
  
  $( "#modalAddContact form" ).submit(function( event ) {
    var post = {};
    $( this ).serializeArray().map(n => {
      if (n['name']=="type") {
        post[n['name']] = [n['value'].trim()];

      } else {
        post[n['name']] = n['value'].trim();
      }
    });
    $.ajax({
      url: "/admin/api/crews/new/",
      method: "post",
      data: post
    }).done(function(data) {
      console.log("#"+id);
    });
    console.log( post );
    event.preventDefault();
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
    post.partner_data = {delegate: post.delegate};
    delete post.delegate;
    post.slug = slugify(post.stagename);
    console.log( post );
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