$(function () {




	$("table").on('reorder-row.bs.table', function (e, data){
		const obj = data.map(item => {return item[0]});
		const id = $(this).data("id");
		const model = $(this).data('model');
		const link = $(this).data('link');
		$.ajax({
			url: "/admin/api/reordered/",
			method: "post",
			data: {id:id, model:model, link:link, obj:obj}
		}).done(function(data) {
			console.log(data);
			console.log("Reordered!!!");
		});
	});

  $( ".edit_partners_partner" ).click(function( event ) {
		const owner = $(this).data("owner");
		const partner = $(this).data("partner");
		const name = $(this).data('name');
		const value = $(this).prop('checked');
		$.ajax({
			url: "/admin/api/partners/status/",
			method: "post",
			data: {id:partner, owner:owner, name:name, value:value}
		}).done(function(data) {
			alert("Done!!!");
		});
  });

  $( ".edit_partners_categories" ).click(function( event ) {
		const owner = $(this).data("owner");
		const partner = $(this).data("partner");
		const category = $(this).data('category');
		const value = $(this).prop('checked');
		$.ajax({
			url: "/admin/api/partners/categories/",
			method: "post",
			data: {id:partner, owner:owner, category:category, value:value}
		}).done(function(data) {
			alert("Done!!!");
		});
  });

  $( ".forceEmailChange" ).click(function( event ) {
    event.preventDefault();
		const owner = $(this).data("id");
		const oldemail = $(this).data("oldemail");
		$("#modalForceEmailChange .id").val(owner)
		$("#modalForceEmailChange .oldemail").val(oldemail)
		$('#modalForceEmailChange .alert').addClass('d-none');
		$("#modalForceEmailChange").modal()

  });
  $("#modalForceEmailChange form").submit(function(event) {
    event.preventDefault();
    var datastring = $("#modalForceEmailChange form").serialize();
    $.ajax({
      type: "POST",
      url: "/admin/api/forceemailchange",
      data: datastring
    }).
    done(function(data) {
      if (data.errors) {
        $('#modalForceEmailChange .alert').html(data.errors.message);
        $('#modalForceEmailChange .alert').addClass('alert-danger');
        $('#modalForceEmailChange .alert').removeClass('alert-success');
        $('#modalForceEmailChange .alert').removeClass('d-none');
      } else {
        $('#modalForceEmailChange .alert').html("Data saved with success.");
        $('#modalForceEmailChange .alert').removeClass('alert-danger');
        $('#modalForceEmailChange .alert').addClass('alert-success');
        $('#modalForceEmailChange .alert').removeClass('d-none');
      }
      //console.log(data);
    })
    .fail(function (jqXHR, textStatus) {
      $('#modalForceEmailChange .alert').html("Internal Server Error");
			$('#modalForceEmailChange .alert').addClass('alert-danger');
			$('#modalForceEmailChange .alert').removeClass('alert-success');
			$('#modalForceEmailChange .alert').removeClass('d-none');
		});
  });

	// ADMIN PROFILE / GROUPS
	if ($( ".getgroups button" ).length) {
		function ActionFormatter(index, row) {
			console.log("index");
			console.log(index);
			console.log(row);
			return "<a href=\"https://www.facebook.com/groups/"+row.id+"/\" target=\"_blank\">https://fb.com/"+row.id+"</a>";
		} 
		function fbLogin() {
			FB.login(function(response) {
				FB.api(
					'/me/accounts?fields=name',
					'GET',
					{"limit":"1000"},
					function(response) {
						console.log(response)
						var rows = []
						for(var a=0;a<response.data.length;a++) {
							rows.push({
								id: response.data[a].id,
								name: response.data[a].name
							});
							//$(".profilegroups tbody").append("<tr id=\"row"+response.data[a].id+"\"><td></td></tr>")
						}
						console.log(rows)
						//$(".profilegroups").bootstrapTable('append', rows)
						//Insert your code here
					}
				);
				if (response.authResponse) {
					console.log('Welcome!');
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			});
		} 
		function getGroups(profile) {
			console.log('Fetching your information...');
			FB.api(
				'/'+profile+'/groups',
				'GET',
				{"limit":"1000"},
				function(response) {
					console.log(response)
					var rows = []
					for(var a=0;a<response.data.length;a++) {
						rows.push({
							id: response.data[a].id,
							name: response.data[a].name,
							profile: profile
						});
						//$(".profilegroups tbody").append("<tr id=\"row"+response.data[a].id+"\"><td></td></tr>")
					}
					console.log(rows)
					$(".profilegroups").bootstrapTable('append', rows)
					//Insert your code here
				}
			);
		}
		$( ".fblogin" ).click(function( event ) {
			console.log(FB)
			fbLogin()
		});
	
		$( ".getgroups button" ).click(function( event ) {
			console.log(FB)
			console.log($( ".getgroups input" ).val())
			getGroups($( ".getgroups input" ).val())
		});	
	}


	$( ".categories_filter" ).click(function( event ) {
		if ($( ".categories_filter" ).prop('checked')) {
			$( ".anykind" ).prop('checked',false);
			$( ".nokind" ).prop('checked',false);
		}
  });

  $( ".nokind" ).click(function( event ) {
		if ($( ".nokind" ).prop('checked')) {
			$( ".anykind" ).prop('checked',false);
			$( ".categories_filter" ).prop('checked',false);
		}
  });

  $( ".anykind" ).click(function( event ) {
		if ($( ".anykind" ).prop('checked')) {
			$( ".categories_filter" ).prop('checked',false);
			$( ".nokind" ).prop('checked',false);
		}
  });


	$('.delete').click(function (event) {
    event.preventDefault();
    var sez = $(this).data('sez'); // Extract info from data-* attributes
    var id = $(this).data('id'); // Extract info from data-* attributes
		$('#msg_modal').modal('show');
		$('#msg_modal	.modal-confirm').removeClass('btn-primary');
		$('#msg_modal	.modal-confirm').addClass('btn-danger');
		$('#msg_modal	.modal-confirm').html('DELETE');
		$('#msg_modal	.modal-confirm').removeAttr("disabled");
		$('#msg_modal	.modal-confirm').attr('data-id', id);
		$('#msg_modal	.modal-confirm').attr('data-sez', sez); 
		$('#msg_modal	.modal-confirm').removeAttr('data-dismiss');
		$('#msg_modal	.modal-body').html('Are you sure you want to delete it?');
		$('#msg_modal	.modal-confirm').click(function (event) {
			$('#msg_modal	.modal-body').html('<div class="text-center h1"><i class="icon-spinner animate-spin"></i></div>')
			//console.log(sez);
			//console.log(id);
			//console.log("/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete");
			$('#msg_modal	.modal-confirm').attr("disabled", true);
			$.ajax({
				url: "/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete",
				method: "get",
				data: {delete: 1}
			})
			.done(function(data) {
				if (data && data.length && data[0].error) {
					$('#msg_modal	.modal-body').html('<div class="alert alert-danger">'+data[0].error+'</div>');
				} else {
					$("#"+id).html('<td colspan="'+$("#"+id).children().length+'"><div class="alert alert-success mb-0">'+Object.keys(data)[0] + " Deleted with success"+'</div></td>');
					$('#msg_modal').modal('hide');
				}
			})
			.fail(function(data) {
				console.log("error");
				console.log(data);
			});
		});
	});
  
	$('.deletedett').click(function (event) {
    //event.preventDefault();
    var sez = $(this).data('sez'); // Extract info from data-* attributes
    var id = $(this).data('id'); // Extract info from data-* attributes
		$('#msg_modal').modal('show');
		$('#msg_modal	.modal-confirm').removeClass('btn-primary');
		$('#msg_modal	.modal-confirm').addClass('btn-danger');
		$('#msg_modal	.modal-confirm').html('DELETE');
		$('#msg_modal	.modal-confirm').removeAttr("disabled");
		$('#msg_modal	.modal-confirm').attr('data-id', id);
		$('#msg_modal	.modal-confirm').attr('data-sez', sez); 
		$('#msg_modal	.modal-confirm').removeAttr('data-dismiss');
		$('#msg_modal	.modal-body').html('Are you sure you want to delete it?');
		$('#msg_modal	.modal-confirm').click(function (event) {
			$('#msg_modal	.modal-body').html('<div class="text-center h1"><i class="icon-spinner animate-spin"></i></div>')
			//console.log(sez);
			//console.log(id);
			//console.log("/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete");
			$('#msg_modal	.modal-confirm').attr("disabled", true);
			$.ajax({
				url: "/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete",
				method: "get",
				data: {delete: 1}
			})
			.done(function(data) {
				if (data && data.length && data[0].error) {
					$('#msg_modal	.modal-body').html('<div class="alert alert-danger">'+data[0].error+'</div>');
				} else {
					$('.formcontainer').html('<div class="alert alert-success mt-3">'+Object.keys(data)[0] + " Deleted with success <b><a href=\"/admin/"+sez+"\">BACK TO LIST</a></b>"+'</div>');
					$('#msg_modal').modal('hide');
				}
			})
			.fail(function(data) {
				console.log("error");
				console.log(data);
			});
		});
	});
  
	$('.unlink').click(function (event) {
    event.preventDefault();
    var sez = $(this).data('sez'); // Extract info from data-* attributes
    var id = $(this).data('id'); // Extract info from data-* attributes
    var child = $(this).data('child'); // Extract info from data-* attributes
    var childtype = $(this).data('childtype'); // Extract info from data-* attributes
		$('#msg_modal').modal('show');
		$('#msg_modal	.modal-confirm').removeClass('btn-primary');
		$('#msg_modal	.modal-confirm').addClass('btn-danger');
		$('#msg_modal	.modal-confirm').html('UNLINK');
		$('#msg_modal	.modal-confirm').removeAttr("disabled");
		$('#msg_modal	.modal-confirm').attr('data-id', id);
		$('#msg_modal	.modal-confirm').attr('data-sez', sez); 
		$('#msg_modal	.modal-confirm').removeAttr('data-dismiss');
		$('#msg_modal	.modal-body').html('Are you sure you want to unlink it?');
		$('#msg_modal	.modal-confirm').click(function (event) {
			$('#msg_modal	.modal-body').html('<div class="text-center h1"><i class="icon-spinner animate-spin"></i></div>')
			//console.log(sez);
			//console.log(id);
			//console.log("/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/unlink");
			$('#msg_modal	.modal-confirm').attr("disabled", true);
			$.ajax({
				url: "/admin/api/"+sez+"/"+id+"/"+childtype+"/"+child+"/unlink",
				method: "get",
				data: {delete: 1}
			})
			.done(function(data) {
				if (data && data.length && data[0].error) {
					$('#msg_modal	.modal-body').html('<div class="alert alert-danger">'+data[0].error+'</div>');
				} else {
					$("#"+id).html('<td colspan="'+$("#"+id).children().length+'"><div class="alert alert-success mb-0">'+Object.keys(data)[0] + " Deleted with success"+'</div></td>');
					$('#msg_modal').modal('hide');
				}
			})
			.fail(function(data) {
				console.log("error");
				console.log(data);
			});
		});
	});
  
/*   $('.s').click(function (event) {
    event.preventDefault();
    var sez = $(this).data('sez'); // Extract info from data-* attributes
    var id = $(this).data('id'); // Extract info from data-* attributes
		$('#msg_modal').modal('show');
		$('#msg_modal	.modal-confirm').removeClass('btn-primary');
		$('#msg_modal	.modal-confirm').addClass('btn-danger');
		$('#msg_modal	.modal-confirm').html('DELETE');
		$('#msg_modal	.modal-confirm').removeAttr("disabled");
		$('#msg_modal	.modal-confirm').attr('data-id', id);
		$('#msg_modal	.modal-confirm').attr('data-sez', sez); 
		$('#msg_modal	.modal-confirm').removeAttr('data-dismiss');
		$('#msg_modal	.modal-body').html('Are you sure you want to delete it?');
		$('#msg_modal	.modal-confirm').click(function (event) {
			$('#msg_modal	.modal-body').html('<div class="text-center h1"><i class="icon-spinner animate-spin"></i></div>')
			//console.log(sez);
			//console.log(id);
			//console.log("/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete");
			$('#msg_modal	.modal-confirm').attr("disabled", true);
			$.ajax({
				url: "/admin/api/"+(sez=="crews" ? "profile" : sez)+"/"+id+"/delete",
				method: "get",
				data: {delete: 1}
			})
			.done(function(data) {
				if (data && data.length && data[0].error) {
					$('#msg_modal	.modal-body').html('<div class="alert alert-danger">'+data[0].error+'</div>');
				} else {
					window.location.href = "/admin/"+sez+"/";
				}
			})
			.fail(function(data) {
				console.log("error");
				console.log(data);
			});
		});
	});
  
 */
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
			var list = "#"+$(this).data("duplicate");
			var clone = $($(list).children()[$(list).children().length-1]).clone();
			$(clone).find(".number").text($(list).children().length+1);
			$(clone).find("input").each(function () {
				if ($(this).attr("name"))
					$(this).attr("name", $(this).attr("name").replace(/\[([0-9]+)\]/g, "["+$(list).children().length+"]"))
			});
			$(list).append(clone);
		});
	}
	//duplicator
	if ($(".duplicator") && $(".duplicator").length) {
		$(".duplicator").on("click", function () {
			var list = $("#"+$(this).data("duplicate"));
			var clone = $($(list).children()[0]).clone();
			clone.find('button').each(function() {
				$(this).removeAttr('disabled');
			});
			console.log(clone.find('input').attr('name'));
			console.log($(list).children().length);
			clone.find('input').each(function() {
				this.name= this.name.replace('[0]', '['+($(list).children().length+1)+']');
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
	    	timeout: 0,
			thumbnailWidth: 400,
			thumbnailHeight:400,
			previewTemplate: tpl,
			init: function () {
				this.on("addedfile", function(file) { 
					$(".enableBorder").addClass("d-none");
					var dz = this
					file.previewElement.addEventListener("click", function() {
						dz.removeFile(file);
					});
				});
				this.on("removedfile", function(file) {
					$("#image-preview").removeClass("d-none");
					$("#formupload").addClass("d-none");
				});
				this.on("success", function(file, data) {
					if (data && data.length && data[0].err) {
						$(".data-dz-remove").removeClass("d-none");
						$(".progress-bar").css('width', '0');
						$(".dz-error-message").removeClass("d-none");
						$(".dz-error-message").html(''+data[0].err+'');
					} else {
						var dz = this
 						$("#image-preview img").attr("src", data.imageFormats.large)
						$("#image-preview").removeClass("d-none");
						$("#formupload").addClass("d-none");
						dz.removeAllFiles()
						//$(".dz-error-message").html('<div class="alert alert-danger">'+error.errors.image[0].err+'</div>');
					}
				});
				this.on("error", function(file, error) {
					var err = error && error[0] && error[0].err ? error[0].err : error
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
			maxFilesize: 10000, // MB
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
					var err;
					if (error.message) {
						error.message = JSON.parse(error.message);
						err = error.message.message
						console.log(error)
					} else {
						err = error.errors && error.errors.image && error.errors.image[0] && error.errors.image[0].err ? error.errors.image[0].err : error
					}
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
		tpl+= '  <div class="dz-error-message alert alert-danger d-none"><span data-dz-errormessage></span></div>';
		tpl+= '  <div class="dz-success-message alert alert-success d-none"></div>';
		tpl+= '  <div class="data-dz-remove"></div>';
		tpl+= '</div>';
		if (dropzone) dropzone = null;
		function paramNameForSend() {
			return "image";
	 	}
		var dropzone = $("#formmultiupload").dropzone({ 
			url: "/admin/api/galleries/"+get.id+"/medias",
			paramName: paramNameForSend, // The name that will be used to transfer the file
			maxFilesize: 20, // MB
			acceptedFiles: "image/*",
			autoProcessQueue: true,
			addRemoveLinks: false,
			maxFiles: 200,
	    	timeout: 0,
			thumbnailWidth: 320,
			thumbnailHeight:180,
			previewTemplate: tpl,
			uploadMultiple: true, // uplaod files in a single request
			parallelUploads: 200, // use it with uploadMultiple
			init: function () {
				this.on("addedfile", function(file) { 
					$("#formmultiupload .enableBorder").addClass("d-none");
				});
				this.on("completemultiple", function(data2) {
					console.log("file")
					console.log(data2)
					if (Array.isArray(data2) && data2.length && data2[0].xhr)
						data2 = JSON.parse(data2[0].xhr.response)
					for (var i=0; i<data2.length; i++) {
						console.log("errrrr?")
						console.log(data2[i])
						if (data2[i].err || data2[i].status == "error") {
							if (!data2[i].err && data2[i].size/1024 > 2 ) data2[i].err = "Max file size is 2 MB"
							$($(".dz-error-message span")[i]).html(''+data2[i].err+'');
							$($(".progress-bar")[i]).css('width', '0');
							$($(".dz-error-message")[i]).removeClass("d-none");
							$($(".dz-success-message")[i]).addClass("d-none");
						} else {
							$($(".dz-success-message")[i]).html(''+"The file is ok"+'');
							$($(".dz-error-message")[i]).addClass("d-none");
							$($(".dz-success-message")[i]).removeClass("d-none");
							$("#medias").append('<div class="col-md-4 col-sm-6 ui-sortable-handle"><img class="img-fluid" src="'+data2[i].imageFormats.large+'"><div class="d-flex justify-content-between mb-3 mt-1"><input type="hidden" value=\''+JSON.stringify(data2[i])+'\' data-id="'+($("#medias").length)+'" name="mediastr"><input class="form-control title" type="text" value="'+data2[i].title+'"><button class="btn btn-danger ml-2 remove" type="button"><i class="icon-trash"></i></button></div></div>')
						}
					}
					var dz = this
					setTimeout(function(){
						$("#formmultiupload .enableBorder").removeClass("d-none");
						dz.removeAllFiles();
					}, 2000);
					activateSortable();
				});
				this.on("error", function(file, error) {
					console.log(file)
					console.log(error)
					/* for (var i=0; i<error.length; i++) {
						if (error[i].err) {
							$($(".dz-error-message span")[i]).html(''+error[i].err+'');
							$($(".progress-bar")[i]).css('width', '0');
							$($(".dz-error-message")[i]).removeClass("d-none");
							$($(".dz-success-message")[i]).addClass("d-none");
						} else {
							$($(".dz-success-message")[i]).html(''+"The file is ok"+'');
							$($(".dz-error-message")[i]).addClass("d-none");
							$($(".dz-success-message")[i]).removeClass("d-none");
						}
					} */
				});
			}
		});
	}

	if ($("#slug") && $("#slug").length) {
		$('#slug input').on( "keyup", function () {
			console.log(this)
			console.log(get)
			if ($(this).val().length>2) {
				var target = $(this).parent().parent().find(".badge-danger")
				console.log(target);
				$(this).removeClass("is-invalid")
				$.ajax({
					url: "/admin/api/"+get.sez+"/"+get.id+"/"+get.form+"/slugs/"+$(this).val(),
					method: "get"
				}).done((data) => {
					if (data.exist && data.slug!=slug) {
						$(target).html("This slug exists")
						$(this).addClass("is-invalid")
						$(this).removeClass("is-valid")
					} else {
						$(this).addClass("is-valid")
						$(target).html("");
					}
					console.log(data.exist);
					console.log(slug);
				});
			}
		});
	}

	if ($(".autocomplete_users") && $(".autocomplete_users").length) {
		var selectedItem;
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
			noResultsText: "NO user found, think about to invite him to join AVnode"
		});
		removeuser = (elem, event) => {
			event.preventDefault();
			$("#users .alert").removeClass("alert-danger");
			$("#users .alert").html("");
			$("#users .alert").addClass("d-none")
			if(confirm("Are you sure you want to remove the user?")) {
				$(elem).find("i").addClass("fa-spinner");
				$(elem).find("i").addClass("animate-spin");
				$(elem).find("i").removeClass("fa-trash");
				$.ajax({
					url: "/admin/api/"+get.sez+"/"+$(elem).data("objid")+"/users/remove/"+$(elem).data("id")+"",
					method: "get"
				}).done((data) => {
					$(elem).parent().remove();
				})
				.fail((error) => {
					$(elem).find("i").removeClass("fa-spinner");
					$(elem).find("i").removeClass("animate-spin");
					$(elem).find("i").addClass("fa-trash");
					$("#users .alert").addClass("alert-danger");
					$("#users .alert").html(error.responseJSON.message);
					$("#users .alert").removeClass("d-none")
					console.log(error);
				});
			}
		}
		$("#users a").on("click", function (event) {
			removeuser(this, event)
		});
		$('.autocomplete_users input').on('autocomplete.select', function (evt, item) {
			selectedItem = item;
			$('.autocomplete_users button').removeClass("disabled");
		});
		$('.autocomplete_users button').on("click", function () {
			var objid = $(this).data("objid");
			var obj = $(this).data("obj");
			$("#users").append('<div class="mb-3 saving"><a href="#" data-objid="'+objid+'" data-obj="'+obj+'"><i class="icon-spinner animate-spin"></i></a> | '+selectedItem.text+'</div>')
			$.ajax({
				url: "/admin/api/"+ obj +"/"+ objid +"/users/add/"+selectedItem.value,
				method: "get"
			}).done((data) => {
				$("#users .saving a:last i").removeClass("fa-spinner");
				$("#users .saving a:last i").removeClass("animate-spin");
				$("#users .saving a:last i").addClass("fa-trash");
				$("#users .saving a:last").attr("data-id", selectedItem.value)
				$("#users .saving").removeClass("saving");
				$("#users a:last").on("click", function (event) {
					removeuser(this, event)
				});
			});
		});
	}

	if ($(".autocomplete_performance") && $(".autocomplete_performance").length) {
		var selectedItem;
		$('.autocomplete_performance input').autoComplete({
			resolverSettings: {
					url: "/admin/api/getperformances/"+$(this).val()
			},
			bootstrapVersion: "4",
			minLength: 3,
			events: {
				search: addPerformanceAutocomplete/* ,
				formatResult: addperformanceAutocompleteSelect */
			},
			noResultsText: "NO performance found, think about to invite him to join AVnode"
		});
		$('.autocomplete_performance button').on("click", function () {
			var objid = $(this).data("objid");
			var obj = $(this).data("obj");
			$("#performances").append('<div class="mb-3 saving"><a href="#" data-objid="'+objid+'" data-obj="'+obj+'"><i class="icon-spinner animate-spin"></i></a> | '+selectedItem.text+'</div>')
			$.ajax({
				url: "/admin/api/"+ obj +"/"+ objid +"/performance/add/"+selectedItem.value,
				method: "get"
			})
			.done(function(data) {
				console.log(data);
				location.reload();
			})
			.fail(function(err) {
					$(".autocomplete_performance_err").html(err.responseJSON.message);
					$(".autocomplete_performance_err").removeClass("d-none");	
			})
		});
		$('.autocomplete_performance input').on('autocomplete.select', function (evt, item) {
			$('.autocomplete_performance button').removeClass("disabled");
			selectedItem = item;
		});
	}

	if ($(".autocomplete_gallery") && $(".autocomplete_gallery").length) {
		var selectedItem;
		$('.autocomplete_gallery input').autoComplete({
			resolverSettings: {
					url: "/admin/api/getgalleries/"+$(this).val()
			},
			bootstrapVersion: "4",
			minLength: 3,
			events: {
				search: addGalleryAutocomplete/* ,
				formatResult: addgalleryAutocompleteSelect */
			},
			noResultsText: "NO gallery found, think about to invite him to join AVnode"
		});
		$('.autocomplete_gallery button').on("click", function () {
			var objid = $(this).data("objid");
			var obj = $(this).data("obj");
			$("#galleries").append('<div class="mb-3 saving"><a href="#" data-objid="'+objid+'" data-obj="'+obj+'"><i class="icon-spinner animate-spin"></i></a> | '+selectedItem.text+'</div>')
			$.ajax({
				url: "/admin/api/"+ obj +"/"+ objid +"/gallery/add/"+selectedItem.value,
				method: "get"
			})
			.done(function(data) {
				console.log(data);
				location.reload();
			})
			.fail(function(err) {
					$(".autocomplete_gallery_err").html(err.responseJSON.message);
					$(".autocomplete_gallery_err").removeClass("d-none");	
			})
		});
		$('.autocomplete_gallery input').on('autocomplete.select', function (evt, item) {
			selectedItem = item;
			$('.autocomplete_gallery button').removeClass("disabled");
		});
	}

	if ($(".autocomplete_video") && $(".autocomplete_video").length) {
		var selectedItem;
		$('.autocomplete_video input').autoComplete({
			resolverSettings: {
					url: "/admin/api/getvideos/"+$(this).val()
			},
			bootstrapVersion: "4",
			minLength: 3,
			events: {
				search: addVideoAutocomplete/* ,
				formatResult: addvideoAutocompleteSelect */
			},
			noResultsText: "NO video found, think about to invite him to join AVnode"
		});
		$('.autocomplete_video button').on("click", function () {
			var objid = $(this).data("objid");
			var obj = $(this).data("obj");
			$("#videos").append('<div class="mb-3 saving"><a href="#" data-objid="'+objid+'" data-obj="'+obj+'"><i class="icon-spinner animate-spin"></i></a> | '+selectedItem.text+'</div>')
			$.ajax({
				url: "/admin/api/"+ obj +"/"+ objid +"/video/add/"+selectedItem.value,
				method: "get"
			})
			.done(function(data) {
				console.log(data);
				location.reload();
			})
			.fail(function(err) {
					$(".autocomplete_video_err").html(err.responseJSON.message);
					$(".autocomplete_video_err").removeClass("d-none");	
			})
		});
		$('.autocomplete_video input').on('autocomplete.select', function (evt, item) {
			selectedItem = item;
			$('.autocomplete_video button').removeClass("disabled");
      if ($("#external-events")) {
				console.log(item)
        var append = "<div class=\"fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event\"><div class=\"fc-event-main\">"+ item.text + "</div></div>";
				$(".attachment-dropzone").hide()
				$("#external-events").append(append)
				new Draggable($("#external-events .fc-event"));
			}
		});
	}

	$(".cancel-sub-admin").on('click', function(ev) {
    cancel_sub(ev, this)
  });

	$(".unlink-admin").on('click', function(ev) {
    unlink_admin(ev, this)
  });
  unlink_admin = (ev, obj) => {
    var result = confirm("Want to unlink?");
    if (result) {
      const id = $(obj).data("id");
      const type = $(obj).data("type");
      const link_id = $(obj).data("link-id");
      const link = $(obj).data("link");
			console.log("unlink_admin")
      $.ajax({
        url: "/admin/api/"+type+"/"+id+"/"+link+"/remove/"+link_id+"",
        method: "get",
        data: {id:id}
      }).done(function(data) {
				console.log("#link"+link_id)
        $("#link"+link_id).remove();
      });
    } 
  }

	if ($(".autocomplete_members") && $(".autocomplete_members").length) {
		var memberToAdd;
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
			noResultsText: "NO user found, think about to invite him to join AVnode"
		});
		removeMember = (elem, event) => {
			event.preventDefault();
			$("#members .alert").removeClass("alert-danger");
			$("#members .alert").html("");
			$("#members .alert").addClass("d-none")
			if(confirm("Are you sure you want to remove elem member?")) {
				$(elem).find("i").addClass("fa-spinner");
				$(elem).find("i").addClass("animate-spin");
				$(elem).find("i").removeClass("fa-trash");
				$.ajax({
					url: "/admin/api/crews/"+$(elem).data("crewid")+"/members/remove/"+$(elem).data("id")+"",
					method: "get"
				}).done((data) => {
					$(elem).parent().remove();
				})
				.fail((error) => {
					$(elem).find("i").removeClass("fa-spinner");
					$(elem).find("i").removeClass("animate-spin");
					$(elem).find("i").addClass("fa-trash");
					$("#members .alert").addClass("alert-danger");
					$("#members .alert").html(error.responseJSON.message);
					$("#members .alert").removeClass("d-none")
					console.log(error);
				});
			}
		}
		addMember = (elem, evt, crewid, item) => {
			console.log('addMember', item);
			//$(elem).parent().find("button").on("click", function () {
				console.log("append");
				console.log('<div class="mb-3 saving"><a href="#" data-crewid="'+crewid+'"><i class="icon-spinner animate-spin"></i></a> | '+item.text+'</div>')
				$("#members").append('<div class="mb-3 saving"><a href="#" data-crewid="'+crewid+'"><i class="icon-spinner animate-spin"></i></a> | '+item.text+'</div>')
				$.ajax({
					url: "/admin/api/crews/"+ crewid +"/members/add/"+item.value,
					method: "get"
				}).done((data) => {
					$("#members .saving a:last i").removeClass("fa-spinner");
					$("#members .saving a:last i").removeClass("animate-spin");
					$("#members .saving a:last i").addClass("fa-trash");
					$("#members .saving a:last").attr("data-id", item.value)
					$("#members .saving").removeClass("saving");
					$("#members a:last").on("click", function (event) {
						removeMember(this, event)
					});
				});
			//});
		}
		$("#members a").on("click", function (event) {
			removeMember(this, event)
		});
		$('.autocomplete_members input').on('autocomplete.select', function (evt, item) {
			console.log('select', item);
			memberToAdd = item;
			$('.autocomplete_members button').removeClass("disabled");
		});
		$('.autocomplete_members button').on('click', function (evt, item) {
			var crewid = $('.autocomplete_members button').data("crewid");
			addMember(this, evt, crewid, memberToAdd);
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
		var item = JSON.parse($(this).parent().find(".mediaitem").val());
		item.title = $(this).val()
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
			"formatted_address": place.formatted_address
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
		res.formatted_address+= res.route ? res.route + (res.street_number ? " "+res.street_number : "") +", " : "";
		res.formatted_address+= res.locality && res.country ? res.locality +", "+ res.country : res.locality ? res.locality : res.country ? res.country : "";
		event.target.value = res.formatted_address
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

/* addMemberAutocompleteSelect = function (qry, callback, origJQElement) {
	console.log(qry)
	console.log(callback)
	console.log(origJQElement)
}

 */
addMemberAutocomplete = function (qry, callback, origJQElement) {
	//console.log(qry)
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

addPerformanceAutocomplete = function (qry, callback, origJQElement) {
	$(".autocomplete_performance_err").addClass("d-none")					
	/* 	$('.autocomplete_users input').on( "blur", function () {
		var inputinput = $(this);
	});
	$('.autocomplete_users input').on( "keyup", function () {
		var inputinput = $(this);
		console.log(this)
		inputinput.parent().find(".dropdown-menu").addClass("show") */
		if (qry.length>2) {
			$.ajax({
				url: "/admin/api/getperformances/"+qry,
				method: "get",
				dataType: "json"
			}).done((data) => {
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text:data[item].title
					})
				}
				callback(res)
			});
		}
	//});
}

addGalleryAutocomplete = function (qry, callback, origJQElement) {
	$(".autocomplete_gallery_err").addClass("d-none")					
	/* 	$('.autocomplete_users input').on( "blur", function () {
		var inputinput = $(this);
	});
	$('.autocomplete_users input').on( "keyup", function () {
		var inputinput = $(this);
		console.log(this)
		inputinput.parent().find(".dropdown-menu").addClass("show") */
		if (qry.length>2) {
			$.ajax({
				url: "/admin/api/getgalleries/"+qry,
				method: "get",
				dataType: "json"
			}).done((data) => {
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text:data[item].title
					})
				}
				callback(res)
			});
		}
	//});
}

addVideoAutocomplete = function (qry, callback, origJQElement) {
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
				url: "/admin/api/getvideos/"+qry,
				method: "get",
				dataType: "json"
			}).done((data) => {
				var res = []
				for(var item in data) {
					res.push({
						value: data[item]._id,
						text:data[item].title
					})
				}
				callback(res)
			});
		}
	//});
}
