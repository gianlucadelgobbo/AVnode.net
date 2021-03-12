if ($("#my-video").length) {
  var logo_url 

  var player = videojs('my-video', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    fluid: true,
    playbackRates: [1, 1.5, 2],
    liveui: false
  }, ()=>{
    setTimeout(()=>{
      $('.vjs-logo-content').html($('.toclone').html());
    }, 500)
  });

  // Title Author
  var myTitleAuthor = player.logo({
    image: 'https://avnode.net/images/empty.png',
    height: 50,
    offsetH: 0,
    offsetV: 0,
    fadeDelay: null,
    hideOnReady: false,
    position: 'top-left',
    width: 150
  });
  player.on("useractive",()=>{
    myTitleAuthor.show();
  })
  player.on("userinactive",()=>{
    myTitleAuthor.hide();
  })
  player.getChild('ControlBar').removeChild("PictureInPictureToggle");
  player.getChild('ControlBar').removeChild("SeekToLive");

  // Modal Embed
  var myModal
  player.ready(function() {
    modalcreate();
  });
  modalcreate = () => {
    myPlayer = this;
    options = {};
    var contentEl = document.createElement('div');
    // probably better to just build the entire thing via DOM methods
    contentEl.innerHTML = '<h1 class="vp-share-title vp-share-title--embed">Embed</h1><p class="vp-share-subtitle vp-share-subtitle--embed">Add this video to your site with the embed code below.</p><textarea id="copy_content" class="form-control"><iframe title=&quot;avnode-player&quot; src=&quot;'+logo_url+'?oembed=1&quot; width=&quot;640&quot; height=&quot;290&quot; frameborder=&quot;0&quot; allowfullscreen></iframe></textarea><br /><button type="button" id="mycopy" onclick="myCopy(\'copy_content\', \'mycopy\')" class="btn btn-primary btn-block" data-label="Copy" data-success-label="Copied!">Copy</button>';
    options.content = contentEl;
    options.label = 'embed';
    var ModalDialog = videojs.getComponent('ModalDialog');
    myModal = new ModalDialog(player, options);
    myModal.addClass('vjs-my-custom-modal');
    player.addChild(myModal);
    myModal.on('modalclose', function() {
    modalcreate();
  });

    //myModal.open();
  }
  function myCopy(id, button) {
    /* Get the text field */
    var copyText = document.getElementById(id);
    console.log(document.getElementById(button).dataset.label);
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    document.getElementById(button).innerHTML = document.getElementById(button).dataset.successLabel
    //alert("Copied the text: " + copyText.value);
  }

  class ToolbarLogo extends videojs.getComponent('Button') {
    constructor(player, options = {}) {
      super(player, options);
      this.addClass('vjs-avnode-logo');
    }
    /**
    * Toggle the subtitle track on and off upon click
    handleClick(_e) {
    }
    */
  }
  player.getChild('ControlBar').addChild(new ToolbarLogo(player));
  $('.vjs-avnode-logo').html('<a class="navbar-brand" href="'+logo_url+'" target="_blanck" title="AVnode.net"><img class="main_logo" src="https://avnode.net/images/logo_avnode_bar.svg" height="20" alt="AVnode.net"></a>')
  console.log("swfobjectswfobject")
}

if(swfobject.hasFlashPlayerVersion()){
  var el = document.getElementById("swfcontainer");
  var swf = $(el).data("swf")
  console.log(el["data-swf"])
  swfobject.embedSWF(el["data-swf"], el, 300, 120, 10);
}
