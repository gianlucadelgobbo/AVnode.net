$(function () {

	if ($("#birthday") && $("#birthday").length) {
		$('#birthday').datetimeEntry({datetimeFormat: 'D/O/Y', spinnerBigImage: '/datetimeentry/spinnerDefaultBig.png'});
	}

	if ($(".datetime-format") && $(".datetime-format").length) {
		$('.datetime-format').datetimeEntry({datetimeFormat: 'D/O/Y H:M', spinnerBigImage: '/datetimeentry/spinnerDefaultBig.png'});
	}

	if ($("#types") && $("#types").length) {
		$('#types input.form-check-input').on("change", function () {
			$("#tecnique .tecnique").addClass("d-none")
			$("#tecnique .tecnique .form-check-input").removeAttr("checked")
			$("#"+$(this).attr("id")+"tecnique").removeClass("d-none")
			console.log($(this).attr("id")+"tecnique");
		});
	}

	if ($("#scheduleslist") && $("#scheduleslist").length) {
		$('#scheduleslist .remove').on("click", function () {
			$(this).parent().parent().remove()
			$('#scheduleslist').children().each(function(i, item) {
				console.log($(item).find(".number"))
				$(item).find(".number").text(i+1);
				$(item).find("input").each(function(ii, item2) {
					if ($(item2).attr("name"))
						$(item2).attr("name", $(item2).attr("name").replace(/\[([0-9]+)\]/g, "["+i+"]"))
					if ($(item2).attr("onclick"))
						$(item2).attr("onclick", $(item2).attr("onclick").replace(/\_([0-9]+)\_/g, "_"+i+"_"))
				})
				$(item).find(".collapse").each(function(ii, item2) {
					if ($(item2).attr("id"))
						$(item2).attr("id", $(item2).attr("id").replace(/\_([0-9]+)\_/g, "_"+i+"_"))
				})
			})
		});
	}

	if ($("#medias") && $("#medias").length) {
		activateSortable();
	}
	//duplicator
	if ($(".duplicator2") && $(".duplicator2").length) {
		$(".duplicator2").on("click", function () {
			console.log($(this).data("duplicate"));
			var list = "#"+$(this).data("duplicate");
			var clone = $($(list).children()[$(list).children().length-1]).clone();
			$(clone).find(".number").text($(list).children().length+1);
			console.log(clone)
			$(clone).find("input").each(function () {
				console.log($(this).attr("name"))
				if ($(this).attr("name"))
					$(this).attr("name", $(this).attr("name").replace(/\[([0-9]+)\]/g, "["+$(list).children().length+"]"))
			});
			$(list).append(clone);
		});
	}
	//duplicator
	if ($(".duplicator") && $(".duplicator").length) {
		$(".duplicator").on("click", function () {
			console.log($(this).data("duplicate"));
			var list = $("#"+$(this).data("duplicate"));
			console.log(list);
			console.log(clone);
			clone.find('button').each(function() {
				$(this).removeAttr('disabled');
			});
			clone.find('input').each(function() {
				this.name= this.name.replace('[0]', '['+(list.length+1)+']');
				this.value = "";
			});
			list.append(clone);
			if (addAddressAutocomplete) addAddressAutocomplete();
			if (addLocationAutocomplete) addLocationAutocomplete();
		});
	}
	// UPLOAD IMAGE

	if ($("#formupload") && $("#formupload").length) {
		if ($("#image-preview") && $("#image-preview").length) {
			$("#image-preview").on( "click", function () {
				$("#image-preview").addClass("d-none");
				$("#formupload").removeClass("d-none");
				$(".enableBorder").removeClass("d-none");
			});
		}
		var tpl = '<div class="dz-preview dz-file-preview">';
		tpl+= '  <div class="dz-details">';
		//tpl+= '    <div class="dz-filename"><span data-dz-name></span></div>';
		//tpl+= '    <div class="dz-size" data-dz-size></div>';
		tpl+= '    <img class="img-fluid" data-dz-thumbnail />';
		tpl+= '  </div>';
		tpl+= '  <div class="dz-progress progress mt-2 mb-2"><span class="dz-upload progress-bar progress-bar-striped bg-success" role="progressbar" data-dz-uploadprogress></span></div>';
		//tpl+= '  <div class="dz-success-mark"><span>✔</span></div>';
		//tpl+= '  <div class="dz-error-mark"><span>✘</span></div>';
		tpl+= '  <div class="dz-error-message alert alert-danger d-none"><span data-dz-errormessage></span></div>';
		tpl+= '  <div class="data-dz-remove d-none"><button class="btn btn-primary">TRY AGAIN</button></div>';
		tpl+= '</div>';
		if (dropzone) dropzone = null;
		var dropzone = $("#formupload").dropzone({ 
			url: "/admin/api/"+get.sez+"/"+get.id+"/image",
			paramName: "image", // The name that will be used to transfer the file
			maxFilesize: 2, // MB
			acceptedFiles: "image/*",
			autoProcessQueue: true,
			addRemoveLinks: false,
			maxFiles: 1,
			thumbnailWidth: 400,
			thumbnailHeight:400,
			previewTemplate: tpl,
			init: function () {
				this.on("addedfile", function(file) { 
					$(".enableBorder").addClass("d-none");
					var dz = this
					file.previewElement.addEventListener("click", function() {
						console.log("click")
						dz.removeFile(file);
					});
				});
				this.on("removedfile", function(file) {
					$("#image-preview").removeClass("d-none");
					$("#formupload").addClass("d-none");
				});
				this.on("success", function(file, data) {
					var dz = this
					$("#image-preview img").attr("src", data.imageFormats.large)
					$("#image-preview").removeClass("d-none");
					$("#formupload").addClass("d-none");
					dz.removeAllFiles()
					//$(".dz-error-message").html('<div class="alert alert-danger">'+error.errors.image[0].err+'</div>');
				});
				this.on("error", function(file, error) {
					var err = error.errors && error.errors.image && error.errors.image[0] && error.errors.image[0].err ? error.errors.image[0].err : error
					console.log(error)
					$(".data-dz-remove").removeClass("d-none");
					$(".progress-bar").css('width', '0');
					$(".dz-error-message").removeClass("d-none");
					$(".dz-error-message").html(''+err+'');
				});
			}
		});
	}
	
	if ($("#formuploadvideo") && $("#formuploadvideo").length) {
		if ($("#video-preview") && $("#video-preview").length) {
			$("#video-preview").on( "click", function () {
				$("#video-preview").addClass("d-none");
				$("#formuploadvideo").removeClass("d-none");
				$(".enableBorder").removeClass("d-none");
			});
		}
		var tpl = '<div class="dz-preview dz-file-preview">';
		tpl+= '  <div class="dz-details">';
		//tpl+= '    <div class="dz-filename"><span data-dz-name></span></div>';
		//tpl+= '    <div class="dz-size" data-dz-size></div>';
		tpl+= '    <img class="img-fluid" data-dz-thumbnail />';
		tpl+= '  </div>';
		tpl+= '  <div class="dz-progress progress mt-2 mb-2"><span class="dz-upload progress-bar progress-bar-striped bg-success" role="progressbar" data-dz-uploadprogress></span></div>';
		//tpl+= '  <div class="dz-success-mark"><span>✔</span></div>';
		//tpl+= '  <div class="dz-error-mark"><span>✘</span></div>';
		tpl+= '  <div class="dz-error-message alert alert-danger d-none"><span data-dz-errormessage></span></div>';
		tpl+= '  <div class="data-dz-remove d-none"><button class="btn btn-primary">TRY AGAIN</button></div>';
		tpl+= '</div>';
		if (dropzone) dropzone = null;
		var dropzone = $("#formuploadvideo").dropzone({ 
			url: "/admin/api/"+get.sez+"/"+get.id+"/video",
			paramName: "media", // The name that will be used to transfer the file
			maxFilesize: 2048, // MB
			acceptedFiles: "video/*",
			autoProcessQueue: true,
			addRemoveLinks: false,
			maxFiles: 1,
	    timeout: 0,
			thumbnailWidth: 225,
			thumbnailHeight:400,
			previewTemplate: tpl,
			init: function () {
				this.on("addedfile", function(file) { 
					$(".enableBorder").addClass("d-none");
					var dz = this
					file.previewElement.addEventListener("click", function() {
						console.log("click")
						dz.removeFile(file);
					});
				});
				this.on("removedfile", function(file) {
					$("#video-preview").removeClass("d-none");
					$("#formuploadvideo").addClass("d-none");
				});
				this.on("success", function(file, data) {
					var dz = this
					$("#video-preview img").attr("src", "/images/default-item-tobeencoded.svg")
					$("#video-preview img").removeClass("d-none");
					$("#video-preview").removeClass("d-none");
					$("#formuploadvideo").addClass("d-none");
					dz.removeAllFiles()
					//$(".dz-error-message").html('<div class="alert alert-danger">'+error.errors.image[0].err+'</div>');
				});
				this.on("error", function(file, error) {
					var err = error.errors && error.errors.image && error.errors.image[0] && error.errors.image[0].err ? error.errors.image[0].err : error
					console.log(error)
					$(".data-dz-remove").removeClass("d-none");
					$(".progress-bar").css('width', '0');
					$(".dz-error-message").removeClass("d-none");
					$(".dz-error-message").html(''+err+'');
				});
			}
		});
	}
	
	if ($("#formmultiupload") && $("#formmultiupload").length) {
		var tpl = '<div class="dz-preview dz-file-preview col-md-4">';
		tpl+= '  <div class="dz-details">';
		//tpl+= '    <div class="dz-filename"><span data-dz-name></span></div>';
		//tpl+= '    <div class="dz-size" data-dz-size></div>';
		tpl+= '    <img class="img-fluid" data-dz-thumbnail src="/images/default-item.svg"/>';
		tpl+= '  </div>';
		tpl+= '  <div class="dz-progress progress mt-2 mb-2"><span class="dz-upload progress-bar progress-bar-striped bg-success" role="progressbar" data-dz-uploadprogress></span></div>';
		//tpl+= '  <div class="dz-success-mark"><span>✔</span></div>';
		//tpl+= '  <div class="dz-error-mark"><span>✘</span></div>';
		tpl+= '  <div class="dz-error-message alert alert-danger"><span data-dz-errormessage></span></div>';
		tpl+= '  <div class="dz-success-message alert alert-success"></div>';
		tpl+= '  <div class="data-dz-remove"></div>';
		tpl+= '</div>';
		if (dropzone) dropzone = null;
		function paramNameForSend() {
			return "image";
	 	}
		var dropzone = $("#formmultiupload").dropzone({ 
			url: "/admin/api/"+get.sez+"/"+get.id+"/medias",
			paramName: paramNameForSend, // The name that will be used to transfer the file
			maxFilesize: 2, // MB
			acceptedFiles: "image/*",
			autoProcessQueue: true,
			addRemoveLinks: false,
			maxFiles: 100,
			thumbnailWidth: 320,
			thumbnailHeight:180,
			previewTemplate: tpl,
			uploadMultiple: true, // uplaod files in a single request
			parallelUploads: 100, // use it with uploadMultiple
			init: function () {
				this.on("addedfile", function(file) { 
					$("#formmultiupload .enableBorder").addClass("d-none");
					var dz = this
					$("#rowformmultiuploadbuttons .tryagain").on("click", function(){
						for (var item=0; item<dz.files.length; item++) {
							if($(dz.files[item].previewElement).find(".alert-danger").length){
								dz.removeFile(dz.files[item])
							} else {
								dz.files[item].status = "queued" 
							}
						}
						dz.processQueue();
					})
					$("#rowformmultiuploadbuttons .cancel").on("click", function(){
						dz.removeAllFiles();
						$("#formmultiupload .enableBorder").removeClass("d-none");
						$("#rowformmultiuploadbuttons").addClass("d-none");
						$("#rowformmultiupload").removeClass("show");
					});
				});
				this.on("success", function(data,data2) {
					var dz = this
					dz.removeAllFiles()
					$("#medias").html("")
					for (var item=0; item<data2.medias.length; item++) {
						$("#medias").append('<div class="col-md-4 col-sm-6 ui-sortable-handle"><img class="img-fluid" src="'+data2.medias[item].imageFormats.large+'"><div class="d-flex justify-content-between mb-3 mt-1"><input class="form-control mediaitem" type="text" value=\''+JSON.stringify(data2.medias[item])+'\' data-id="'+item+'" name="mediastr"><input class="form-control title" type="text" value="'+data2.medias[item].title+'"><button class="btn btn-danger ml-2 remove" type="button"><i class="fa fa-trash"></i></button></div></div>')
					}
					activateSortable();
					$("#formmultiupload .enableBorder").removeClass("d-none");
					$("#rowformmultiuploadbuttons").addClass("d-none");
					$("#rowformmultiupload").removeClass("show");
				});
				this.on("error", function(file, error) {
					$("#rowformmultiuploadbuttons").removeClass('d-none');
					$(".progress-bar").css('width', '0');
					for (var i=0; i<error.image.length; i++) {
						if (error.image[i].err) {
							$($(".dz-error-message span")[i]).html(''+error.image[i].err+'');
						} else {
							$($(".dz-success-message")[i]).html(''+"The file is ok"+'');
						}
					}
				});
			}
		});
	}

	if ($("#slug") && $("#slug").length) {
		$('#slug').on( "keyup", function () {
			console.log(this)
			if ($('#slug').val().length>2) {
				var target = $('#slug').parent().parent().find(".error-message")
				$.ajax({
					url: "/admin/api/"+get.sez+"/"+get.id+"/"+get.form+"/slugs/"+$('#slug').val(),
					method: "get"
				}).done((data) => {
					if (data.exist && data.slug!=slug) {
						$(target).html("stocazzaaao")
					} else {
						$(target).html("");
					}
					console.log(data.exist);
					console.log(slug);
				});
			}
		});
	}

	if ($(".autocomplete_users") && $(".autocomplete_users").length) {
		$('.autocomplete_users input').autoComplete({
			resolverSettings: {
					url: "/admin/api/getauthors/"+$(this).val()
			},
			bootstrapVersion: "4",
			minLength: 3,
			events: {
				search: addUserAutocomplete/* ,
				formatResult: addUserAutocompleteSelect */
			},
			noResultsText: "NO performers found, think about to invite him to join AVnode"
		});
		removeuser = (elem, event) => {
			event.preventDefault();
			$("#users .alert").removeClass("alert-danger");
			$("#users .alert").html("");
			$("#users .alert").addClass("d-none")
			if(confirm("Are you sure you want to remove elem user?")) {
				$(elem).find("i").addClass("fa-spinner");
				$(elem).find("i").addClass("fa-spin");
				$(elem).find("i").removeClass("fa-trash");
				$.ajax({
					url: "/admin/api/crews/"+$(elem).data("crewid")+"/users/remove/"+$(elem).data("id")+"",
					method: "get"
				}).done((data) => {
					$(elem).parent().remove();
				})
				.fail((error) => {
					$(elem).find("i").removeClass("fa-spinner");
					$(elem).find("i").removeClass("fa-spin");
					$(elem).find("i").addClass("fa-trash");
					$("#users .alert").addClass("alert-danger");
					$("#users .alert").html(error.responseJSON.message);
					$("#users .alert").removeClass("d-none")
					console.log(error);
				});
			}
		}
		adduser = (elem, evt, item) => {
			console.log('select', item);
			$(elem).parent().find("button").removeClass("disabled");
			$(elem).parent().find("button").on("click", function () {
				var objid = $(this).data("objid");
				var obj = $(this).data("obj");
				$("#users").append('<div class="mb-3 saving"><a href="#" data-objid="'+objid+'" data-obj="'+obj+'"><i class="fa fa-spinner fa-spin"></i></a> | '+item.text+'</div>')
				$.ajax({
					url: "/admin/api/"+ obj +"/"+ objid +"/users/add/"+item.value,
					method: "get"
				}).done((data) => {
					$("#users .saving a i").removeClass("fa-spinner");
					$("#users .saving a i").removeClass("fa-spin");
					$("#users .saving a i").addClass("fa-trash");
					$("#users .saving a").attr("data-id", item.value)
					$("#users .saving").removeClass("saving");
					$("#users a").on("click", function (event) {
						removeuser(this, event)
					});
				});
			});
		}
		$("#users a").on("click", function (event) {
			removeuser(this, event)
		});
		$('.autocomplete_users input').on('autocomplete.select', function (evt, item) {
			adduser(this, evt, item);
		});
	}

	if ($(".autocomplete_members") && $(".autocomplete_members").length) {
		$('.autocomplete_members input').autoComplete({
			resolverSettings: {
					url: "/admin/api/getmembers/"+$(this).val()
			},
			bootstrapVersion: "4",
			minLength: 3,
			events: {
				search: addMemberAutocomplete/* ,
				formatResult: addMemberAutocompleteSelect */
			},
			noResultsText: "NO performers found, think about to invite him to join AVnode"
		});
		removeMember = (elem, event) => {
			event.preventDefault();
			$("#members .alert").removeClass("alert-danger");
			$("#members .alert").html("");
			$("#members .alert").addClass("d-none")
			if(confirm("Are you sure you want to remove elem member?")) {
				$(elem).find("i").addClass("fa-spinner");
				$(elem).find("i").addClass("fa-spin");
				$(elem).find("i").removeClass("fa-trash");
				$.ajax({
					url: "/admin/api/crews/"+$(elem).data("crewid")+"/members/remove/"+$(elem).data("id")+"",
					method: "get"
				}).done((data) => {
					$(elem).parent().remove();
				})
				.fail((error) => {
					$(elem).find("i").removeClass("fa-spinner");
					$(elem).find("i").removeClass("fa-spin");
					$(elem).find("i").addClass("fa-trash");
					$("#members .alert").addClass("alert-danger");
					$("#members .alert").html(error.responseJSON.message);
					$("#members .alert").removeClass("d-none")
					console.log(error);
				});
			}
		}
		addMember = (elem, evt, item) => {
			console.log('select', item);
			$(elem).parent().find("button").removeClass("disabled");
			$(elem).parent().find("button").on("click", function () {
				var crewid = $(this).data("crewid");
				$("#members").append('<div class="mb-3 saving"><a href="#" data-crewid="'+crewid+'"><i class="fa fa-spinner fa-spin"></i></a> | '+item.text+'</div>')
				$.ajax({
					url: "/admin/api/crews/"+ crewid +"/members/add/"+item.value,
					method: "get"
				}).done((data) => {
					$("#members .saving a i").removeClass("fa-spinner");
					$("#members .saving a i").removeClass("fa-spin");
					$("#members .saving a i").addClass("fa-trash");
					$("#members .saving a").attr("data-id", item.value)
					$("#members .saving").removeClass("saving");
					$("#members a").on("click", function (event) {
						removeMember(this, event)
					});
				});
			});
		}
		$("#members a").on("click", function (event) {
			removeMember(this, event)
		});
		$('.autocomplete_members input').on('autocomplete.select', function (evt, item) {
			addMember(this, evt, item);
		});
	}

	if ($(".validateemail") && $(".validateemail").length) {
		validateEmail = (email) => {
			var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return re.test(email)
		}
		$('#addemail input').on( "keyup", function () {
			var emailresult = $(this).parent().parent().find(".emailresult");
			if (!emailresult.hasClass("d-none")) {
				emailresult.addClass("d-none")
				emailresult.removeClass("alert-danger")
				emailresult.removeClass("alert-danger")	
			}
		});
		$('.validateemail').on( "click", function () {
			var email = $(this).parent().parent().find("input").val().trim();
			var emailresult = $(this).parent().parent().parent().find(".emailresult");
			console.log(validateEmail(email))
			if (validateEmail(email)) {
				$.ajax({
					url: "/admin/api/profile/emails/verify/"+email,
					method: "get"
				}).done((data) => {
					emailresult.removeClass("d-none")
					if (data.error) {
						emailresult.addClass("alert-danger")
						emailresult.html(data.msg)
					} else {
						emailresult.addClass("alert-danger")
						emailresult.html(data.msg)
					}
					console.log(data.exist);
					console.log(slug);
				});
			} else {
				emailresult.removeClass("d-none")
				emailresult.addClass("alert-danger")
				emailresult.html("Email is not valid")
			}
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
		addLocationAutocomplete();
	}

	if ($(".address-search-input") && $(".address-search-input").length) {
		$(".address-search-input").on("keyup", function() {
			$(this).parent().find(".lat").val("");
			$(this).parent().find(".lng").val("");
			$(this).parent().find(".locality").val("");
			$(this).parent().find(".country").val("");
			$(this).parent().find(".formatted_address").val("");
			$(this).parent().find(".street_number").val("");
			$(this).parent().find(".route").val("");
			$(this).parent().find(".postal_code").val("");
	});
		$(".address-search-input").on("blur", function() {
			$(this).val($(this).parent().find(".formatted_address").val());
		});
		addAddressAutocomplete();
	}
});

activateSortable = () => {
	$( "#medias" ).sortable({});
	$( "#medias .title" ).on("blur", function () {
		console.log("blur")
		var item = JSON.parse($(this).parent().find(".mediaitem").val());
		console.log(item)
		console.log($(this).val())
		item.title = $(this).val()
		console.log(item)
		console.log($(this).parent().find(".mediaitem"))
		$(this).parent().find(".mediaitem").val(JSON.stringify(item))
	});
	$( "#medias .remove" ).on("click", function () {
		$(this).parent().parent().remove()
	});
}

removeItem = (item) => {
	$(item).parent().parent().parent().remove()		
}

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

addAddressAutocomplete = function () {
	$(".address-search-input")
	.geocomplete({
		fields: ["address_components", "geometry", "formatted_address"]
	})
	.bind("geocode:result", (event, place) => {
		console.log(event.target);
		var res = {
			"street_number": "",
			"route": "",
			"postal_code": "",
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
			if (place.address_components[item].types.indexOf("street_number")!==-1) {
				res.street_number = place.address_components[item].long_name
			}
			if (place.address_components[item].types.indexOf("route")!==-1) {
				res.route = place.address_components[item].long_name
			}
			if (place.address_components[item].types.indexOf("postal_code")!==-1) {
				res.postal_code = place.address_components[item].long_name
			}
		}
		if (res.locality=="") {
			for(var item in place.address_components) {
				if (place.address_components[item].types.indexOf("administrative_area_level_3")!==-1) {
					res.locality = place.address_components[item].long_name
				}
			}
		}
		
		$(event.target).parent().find(".lat").val(res.geometry.lat)
		$(event.target).parent().find(".lng").val(res.geometry.lng)
		$(event.target).parent().find(".locality").val(res.locality)
		$(event.target).parent().find(".country").val(res.country)
		$(event.target).parent().find(".formatted_address").val(res.formatted_address)
		$(event.target).parent().find(".street_number").val(res.street_number)
		$(event.target).parent().find(".route").val(res.route)
		$(event.target).parent().find(".postal_code").val(res.postal_code)
		console.log(res);
	});
}

addMemberAutocompleteSelect = function (qry, callback, origJQElement) {
	console.log(qry)
	console.log(callback)
	console.log(origJQElement)
}

addMemberAutocomplete = function (qry, callback, origJQElement) {
	console.log(qry)
/* 	$('.autocomplete_members input').on( "blur", function () {
		var inputinput = $(this);
	});
	$('.autocomplete_members input').on( "keyup", function () {
		var inputinput = $(this);
		console.log(this)
		inputinput.parent().find(".dropdown-menu").addClass("show") */
		if (qry.length>2) {
			$.ajax({
				url: "/admin/api/getmembers/"+qry,
				method: "get",
				dataType: "json"
			}).done((data) => {
				console.log(data)
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text:data[item].stagename
					})
				}
				callback(res)
			});
		}
	//});
}

addUserAutocomplete = function (qry, callback, origJQElement) {
	console.log(qry)
/* 	$('.autocomplete_users input').on( "blur", function () {
		var inputinput = $(this);
	});
	$('.autocomplete_users input').on( "keyup", function () {
		var inputinput = $(this);
		console.log(this)
		inputinput.parent().find(".dropdown-menu").addClass("show") */
		if (qry.length>2) {
			$.ajax({
				url: "/admin/api/getauthors/"+qry,
				method: "get",
				dataType: "json"
			}).done((data) => {
				console.log(data)
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text:data[item].stagename
					})
				}
				callback(res)
			});
		}
	//});
}
