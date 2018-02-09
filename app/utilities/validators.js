var DB = require('../../modules/db-manager');
var ObjectID = require('mongodb').ObjectID;
var Fnc = require('../../modules/general-functions');
var CT = require('../../modules/country-list');
var EM = require('../../modules/email-dispatcher');
var MCapi = require('mailchimp-api');

var titles = {
	"public": 		__("Public data"),
	"mainimage": 	__("Main image"),
	"password": 	__("Change password"),
	"emails": 		__("Emails"),
	"private":		__("Private data"),
	"connections": 	__("Connections")
}

exports.get = function get(req, res) {
	if (req.session.passport.user == null) {
		res.redirect('/controlpanel/login/?from='+req.url);
	} else {
		var id = (req.query.id ? req.query.id : req.session.passport.user._id);
		DB.users.findOne({_id:new ObjectID(id)}, function(err, result){
			var sez = "user";
			if (req.params[0]=="" || req.params[0]=="/") {
				var subsez = "public";
				var msg = [];
				res.render('forms/user_public', {form:"user_public", title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
			} else if (req.params[0]=="/mainimage" || req.params[0]=="/mainimage/") {
				var subsez = "mainimage";
				var msg = [];
				res.render('forms/user_mainimage', {title:__("My Account")+": "+titles[subsez], sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
			} else if (req.params[0]=="/password" || req.params[0]=="/password/") {
				var subsez = "password";
				var msg = [];
				res.render('forms/user_password', {form:"user_password", title:__("My Account")+": "+titles[subsez], sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
			} else if (req.params[0]=="/emails" || req.params[0]=="/emails/") {
				var subsez = "emails";
				var msg = [];
				var conta = 0;
				result.emails.forEach(function(item, index, theArray) {
					var MC = new MCapi.Mailchimp('d6f941b09ba398bb520ffbb594e48054-us7', true);
                    //MC.lists.memberInfo({id:'6be13adfd8', emails:[{email:result.emails[index].email}]}, function (data) {
                    MC.lists.memberInfo({id:'6be13adfd8', emails:[{email:'g.delgobbo@flyer.it'}]}, function (data) {
                        //console.log(data);
                        if (data.success_count) {
                            //console.log(data.data[0].merges.GROUPINGS);
                            for (item in data.data[0].merges.GROUPINGS) {
                                if (data.data[0].merges.GROUPINGS[item].name == "Topics") {
                                    //console.log(data.data[0].merges.GROUPINGS[item].groups);
                                    for (topic in data.data[0].merges.GROUPINGS[item].groups) {
                                        if (!result.emails[index].mailinglists) result.emails[index].mailinglists = {};
                                        if (data.data[0].merges.GROUPINGS[item].groups[topic].interested) result.emails[index].mailinglists[data.data[0].merges.GROUPINGS[item].groups[topic].name] = 1;
                                    }
                                }
                            }
                            result.emails[index].lang = data.data[0].language;
                        }
                        /*
   						for (item in o.CustomFields) {
							if (o.CustomFields[item].Key=="topic") {
								if (!result.emails[index].mailinglists) result.emails[index].mailinglists = {};
								result.emails[index].mailinglists[o.CustomFields[item].Value] = 1;
							}
							if (o.CustomFields[item].Key=="lang") {
								result.emails[index].lang = o.CustomFields[item].Value.toLocaleLowerCase();
							}
						}
						if (conta==theArray.length-1) {
						}
						conta++;
                         */
                        res.render('forms/user_emails', {title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
                    });
				});
			} else if (req.params[0]=="/private" || req.params[0]=="/private/") {
				var subsez = "private";
				var msg = [];
				res.render('forms/user_private', {form:"user_private", title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
			} else if (req.params[0]=="/connections" || req.params[0]=="/connections/") {
				var subsez = "connections";
				var msg = [];
				res.render('forms/user_connections', {title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:result, msg:msg,Fnc:Fnc, user : req.session.passport.user });
			}
		});
	}
};
exports.post = function post(req, res) {
	if (req.session.passport.user == null) {
		res.redirect('/controlpanel/login/?from='+req.url);
	} else {
		var tmp = req.body.form.split("_");
		var form = req.body.form;
		var sez = tmp[0];
		var subsez = tmp[1];
		exports["validate_"+form](req, function(errors, o, m){
			if (errors.length === 0){
				if (o._id) {
				  	DB.users.findOne({_id:new ObjectID(o._id)},function(e, result) {
				  		delete o._id;
				  		delete o.collection;
				  		delete o.form;
				  		var newItem = result;
				  		//var newItem = {};
				  		for(var item in o) {
				  			newItem[item] = o[item];
				  		}
						var sections = ["events","footage","playlists","gallery","performances","tvshow"];
						var miniuser = {_id:newItem._id,old_id:newItem.old_id,display_name:newItem.display_name,permalink:newItem.permalink,files:newItem.files,stats:newItem.stats,members:newItem.members};
						for (var item in sections) {
							if (newItem[sections[item]] && newItem[sections[item]].length) {
								for (var a=0;a<newItem[sections[item]].length;a++) {
									for (var b=0;b<newItem[sections[item]][a].users.length;b++) {
//										if (newItem[sections[item]][a].users[b].permalink == miniuser.permalink) newItem[sections[item]][a].users[b] = miniuser;
										if (newItem[sections[item]][a].users[b]._id.equals(miniuser._id)) newItem[sections[item]][a].users[b] = miniuser;
									}
								}
							}
						}
				  		DB.users.save(newItem, {safe:true}, function(e, success) {
						  	DB.users.findOne({_id:result._id},function(e, result3) {
						  		result3.form = form;
						  		result3.collection = sez;
						  		DB.updateUserRel(result._id, function(success) {
									res.render('forms/'+form, {form:form, title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:result3, msg:{c:[{m:m}]},Fnc:Fnc, user : req.session.passport.user });
						  		});
					  		});
				  		});
					});
				}
			} else {
				res.render('forms/'+form, {form:"user_public", title:__("My Account")+": "+titles[subsez], countries: CT, sez:sez, subsez:subsez, result:req.body, msg:{e:errors},Fnc:Fnc, user : req.session.passport.user });
			}
  		});
	}
};

exports.validate_user_private = function (req,callback) {
	var o = req.body;
	var tmp = o.birthdate.split("-");
	o.birth_date = new Date(o.birthdate);
	delete o.birth;
	delete o.birthdate;
	var errors = [];
	if (o.name=="") errors.push({name:"name",m:__("Name can not be empty")});
	if (o.surname=="") errors.push({name:"surname",m:__("Surname can not be empty")});
	if (o.gender=="") errors.push({name:"gender",m:__("Gender can not be empty")});
	if (o.citizenship=="") errors.push({name:"gender",m:__("Country of citizenship can not be empty")});
	if (!((parseFloat(tmp[2])==o.birth_date.getDate()) && (parseFloat(tmp[1])-1==o.birth_date.getMonth()) && (parseFloat(tmp[0])==o.birth_date.getFullYear()))) errors.push({name:"birthdate",m:__("Birth date is not valid")});
	callback(errors, o, __("Data saved"));
}

exports.validate_user_password = function (req,callback) {
	var o = req.body;
	var errors = [];
	if (o.password != o.password_confirm) {
		errors.push({name:"password_confirm",m:__("Password does not match the confirm password")});
	}
	if (o.password.length<8) {
		errors.push({name:"password",m:__("Password is too short, use at least 8 character")});
	}
	DB.saltAndHash(o.password, function(hash){
		o.data = {};
		o.data.password = hash;
		delete o.password;
		delete o.password_confirm;
		o.doc_id = o._id;
		o.act = "password";
		delete o._id;
		DB.saltAndHash(o.password+req.session.passport.user.emails[0].email,function(hash){
			o.code = hash;
			o.msg = {title:__("Password confirmation"),text:__("Password updated with success, please log in")};
			DB.temp.insert(o, {safe: true}, function(err, record){
				text = _config.siteurl+"/confirm/?code="+o.code;
				EM.sendMail({
				   text:    text, 
				   to:      req.session.passport.user.emails[0].email,
				   subject: _config.sitename + " | " + __("Password confirmation")
				}, function(err, message) {
					delete o.password;
					delete o.code;
					o._id = o.doc_id;
					delete o.doc_id;
					callback(errors, o, __("Password confirmation sent by email"));
				});
	  		});
  		});
	});
}

exports.validate_user_public = function (req,callback) {
	var o = req.body;
	var errors = [];
	for(item in o.locations) {
		o.locations[item] = JSON.parse(o.locations[item]);
	}
	var q = {permalink:o.permalink};
	if (o._id) q._id = {$ne:new ObjectID(o._id)};
	DB.users.findOne(q, function(err, result) {
		if (result) errors.push({name:"permalink",m:__("Profile url already in use")});
		if (o.display_name=="") errors.push({name:"display_name",m:__("Stage name can not be empty")});
		if (!o.locations || o.locations.length==0) errors.push({name:"locations",m:__("Please insert at least 1 place where you are based")});
		callback(errors, o, __("Data saved"));
	});
}

var Validators = {}

Validators.checkClientID = function(clientID){
	var errors = [];
	if(!clientID){
		errors.push({name:"to_client[name]",m:__("You have to insert a valid client")});
	}
	return errors;
}

Validators.checkCF = function (cf) {
	var errors = [];
	var validi, i, s, set1, set2, setpari, setdisp;
	if( cf == '' ) {
		errors.push({name:"fiscal_code",m:__("La lunghezza del codice fiscale non è corretta: il codice fiscale dovrebbe essere lungo esattamente 16 caratteri.")});
	} else{
		cf = cf.toUpperCase();
		if( cf.length != 16 )
			errors.push({name:"fiscal_code",m:__("La lunghezza del codice fiscale non è corretta: il codice fiscale dovrebbe essere lungo esattamente 16 caratteri.")});
		validi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for( i = 0; i < 16; i++ ){
			if( validi.indexOf( cf.charAt(i) ) == -1 )
				errors.push({name:"fiscal_code",m:__("Il codice fiscale contiene un carattere non valido. I caratteri validi sono le lettere e le cifre.")});
		}
		set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
		setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
		s = 0;
		for( i = 1; i <= 13; i += 2 )
			s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
		for( i = 0; i <= 14; i += 2 )
			s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
		if( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) )
			errors.push({name:"fiscal_code",m:__("Il codice fiscale non è corretto: il codice di controllo non corrisponde.")});
	}
	return errors;
}
Validators.checkVAT = function (pi, country, callback) {
	var errors = [];
	switch(country) {
		case "Italy" :
			if( pi == '' ) {
				errors.push({name:"vat_number",m:__("La lunghezza della partita IVA non è corretta: la partita IVA dovrebbe essere lunga esattamente 11 caratteri.")});
			} else {
				if( pi.length != 11 )
					errors.push({name:"vat_number",m:__("La lunghezza della partita IVA non è corretta: la partita IVA dovrebbe essere lunga esattamente 11 caratteri.")});
				validi = "0123456789";
				for( i = 0; i < 11; i++ ){
					if( validi.indexOf( pi.charAt(i) ) == -1 )
						errors.push({name:"vat_number",m:__("La partita IVA contiene un carattere non valido. I caratteri validi sono le cifre.")});
				}
				s = 0;
				for( i = 0; i <= 9; i += 2 )
					s += pi.charCodeAt(i) - '0'.charCodeAt(0);
				for( i = 1; i <= 9; i += 2 ){
					c = 2*( pi.charCodeAt(i) - '0'.charCodeAt(0) );
					if( c > 9 )  c = c - 9;
					s += c;
				}
				if( ( 10 - s%10 )%10 != pi.charCodeAt(10) - '0'.charCodeAt(0) )
					errors.push({name:"vat_number",m:__("La partita IVA non è valida: il codice di controllo non corrisponde.")});
			}
		break;
	}
	return errors;
}

Validators.checkInvoiceNumber = function(invoiceNumber){
	var errors = [];
	if (!invoiceNumber) errors.push({name:"invoice_number",m:__("No invoice number")});
	return errors;
}

Validators.checkInvoiceDate = function(invoiceDate){
	var errors = [];
	if (!invoiceDate) {
		errors.push({name:"invoice_date",m:__("No invoice date")});
	} else {
		var d = invoiceDate.split("/");
		if (!this.is_date(d[2],d[1],d[0])) errors.push({name:"invoice_date",m:__("Invoice date is not date")});
	}
	return errors;
}

Validators.checkDeliveryDate = function(deliveryDate){
	var errors = [];
	if(deliveryDate){
		var d = deliveryDate.split("/");
		if (!this.is_date(d[2],d[1],d[0])){
			errors.push({name:"delivery_date",m:__("Delivery date is not date")});
		}
	}
	return errors;
}

Validators.checkOfferNumber = function(offerNumber){
	var errors = [];
	if (!offerNumber) errors.push({name:"offer_number",m:__("No offer number")});
	return errors;
}

Validators.checkOfferDate = function(offerDate){
	var errors = [];
	if (!offerDate) {
		errors.push({name:"offer_date",m:__("No offer date")});
	} else {
		var d = offerDate.split("/");
		if (!this.is_date(d[2],d[1],d[0])) errors.push({name:"invoice_date",m:__("Invoice date is not date")});
	}
	return errors;
}


// General Functions //
Validators.validateStringLength = function(s, min, max) {
	return s.length <= max && s.length >= min;
}

Validators.is_email = function(e) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(e);
}
Validators.is_date = function (aaaa,mm,gg){
	var res = true;
	mmNew = parseFloat(mm)-1;
	mm = (mmNew.toString().length==1 ? "0"+mmNew : mmNew);
	var dteDate=new Date(aaaa,mm,gg);
	if (!((gg==dteDate.getDate()) && (mm==dteDate.getMonth()) && (aaaa==dteDate.getFullYear())))
		res = false;
	return res;
}

if (typeof exports !== 'undefined') exports.Validators = Validators;
