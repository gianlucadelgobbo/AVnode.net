//mongorestore --drop -d avnode_bruce /data/dumps/avnode_bruce_fixed/avnode_bruce
//mongodump -d avnode_bruce --out /data/dumps/avnode_bruce_fixed
//rsync -a /space/PhpMysql2015/sites/flxer/warehouse/ /sites/avnode/warehouse
var delete = [{country: country, locality: locality}];
for(var b=0;b<e.delete.length;b++){
  db.users.find({"addresses.country": e.delete[b].country, "addresses.locality": e.delete[b].locality}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == e.delete[b].country && e.addresses[a].locality == e.delete[b].locality);
      }
    }
    db.users.save(e);
  });
}

// countryfix
var fix = [
  {find: '00179', replace: 'Italy'},
  {find: '3582 CC', replace: 'Netherlands'},
  {find: 'Be', replace: 'Belgium'},
  {find: 'Ca', replace: 'Canada'},
  {find: 'Cn', replace: 'China'},
  {find: 'De', replace: 'Germany'},
  {find: 'Curitiba / Brasil', replace: 'Brasil'},
  {find: 'Deutschland', replace: 'Germany'},
  {find: 'Es', replace: 'Spain'},
  {find: 'Espana', replace: 'Spain'},
  {find: 'Fi', replace: 'Finland'},
  {find: 'It', replace: 'Italy'},
  {find: 'Jan Mayen', replace: 'Italy'},
  {find: 'Jp', replace: 'Japan'},
  {find: 'Korea North', replace: 'South Korea'},
  {find: 'Korea South', replace: 'South Korea'},
  {find: 'Korea', replace: 'South Korea'},
  {find: 'Korea, South', replace: 'South Korea'},
  {find: 'Loano, Italy', replace: 'Italy'},
  {find: 'Melbourne-australia', replace: 'Australia'},
  {find: 'Mx', replace: 'Mexico'},
  {find: 'Nakano,tokyo,japan', replace: 'Japan'},
  {find: 'Nederland', replace: 'Netherlands'},
  {find: 'Netherland', replace: 'Netherlands'},
  {find: 'New Zeland', replace: 'New Zealand'},
  {find: 'Ph', replace: 'Philippines'},
  {find: 'Rsa', replace: 'South Africa'},
  {find: 'Russian Federation', replace: 'Russia'},
  {find: 'Saint Helena', replace: 'Japan'},
  {find: 'San Jose/ San Francisco', replace: 'United States'},
  {find: 'United States', replace: 'USA'}
];
for(var b=0;b<fix.length;b++){
  printjson(fix[b]);
  db.users.find({"addresses.country": fix[b].find},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == fix[b].find) e.addresses[a].country = fix[b].replace;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"country": fix[b].find}).forEach(function(e) {
    e.country = fix[b].replace;
    var save = db.addressdbs.save(e);
    if (save.getWriteError().code == 11000) {
      printjson("REMOVEEEEE");
      db.addressdbs.remove({_id: e._id});
    }
  });
}

// cityfix #1
/* C
  var unicode = ['\u0370', '\u4e0a', '\u6d77', '\u5317', '\u4eac', '\u5357', '\u4eac', '\u53a6', '\u95e8', '\u5609', '\u5174', '\u592a', '\u539f', '\u5ba3', '\u6b66', '\u5e7f', '\u5dde', '\u6210', '\u90fd', '\u6625', '\u65e5', '\u90e8', '\u5e02', '\u6b66', '\u6c49', '\u6c55', '\u5934', '\u6c5f', '\u82cf', '\u6c88', '\u9633', '\u6d1b', '\u6749', '\u77f6', '\u6d1b', '\u6749', '\u77f6', '\u6d59', '\u6c5f', '\u6d59', '\u6c5f', '\u7ecd', '\u5174', '\u6e29', '\u5dde', '\u8944', '\u9633', '\u897f', '\u5b89', '\u8fbd', '\u5b81', '\u6c88', '\u9633', '\u90d1', '\u5dde', '\u91cd', '\u5e86'];
  var utf8 = [];

  unicode.forEach(function(e){
    utf8.push(unescape(encodeURIComponent(e)));
  });
  console.log(JSON.stringify(utf8));
*/
var sanitize = function (str) {
  return str.	
  replace('u00e9', 'é').	
  replace('u00fa', 'ú').	
  replace('u0159', 'ř').	
  replace('u010d', 'č').	
  replace('u00ed', 'í').	
  replace('u00c9', 'é').	
  replace('u00fc', 'ü').	
  replace('u00e0', 'à').	
  replace('u00e9', 'é').	
  replace('u00f6', 'ö').	
  replace('u00e1', 'à').	
  replace('U010c', 'Č').	
  replace('u0020', ' ').	
  replace('u0021', '!').	
  replace('u0022', '"').	
  replace('u0023', '#').	
  replace('u0024', '$').	
  replace('u0025', '%').	
  replace('u0026', '&').	
  replace('u0027', ' ').	
  replace('u0028', '(').	
  replace('u0029', ')').	
  replace('u002a', '*').	
  replace('u002b', '+').	
  replace('u002c', ',').	
  replace('u002d', '-').	
  replace('u002e', '.').	
  replace('u002f', '/').	
  replace('u0030', '0').	
  replace('u0031', '1').	
  replace('u0032', '2').	
  replace('u0033', '3').	
  replace('u0034', '4').	
  replace('u0035', '5').	
  replace('u0036', '6').	
  replace('u0037', '7').	
  replace('u0038', '8').	
  replace('u0039', '9').	
  replace('u003a', ':').	
  replace('u003b', ';').	
  replace('u003c', '<').	
  replace('u003d', '+').	
  replace('u003e', '>').	
  replace('u003f', '?').	
  replace('u0040', '@').	
  replace('u0041', 'A').	
  replace('u0042', 'B').	
  replace('u0043', 'C').	
  replace('u0044', 'D').	
  replace('u0045', 'E').	
  replace('u0046', 'F').	
  replace('u0047', 'G').	
  replace('u0048', 'H').	
  replace('u0049', 'I').	
  replace('u004a', 'J').	
  replace('u004b', 'K').	
  replace('u004c', 'L').	
  replace('u004d', 'M').	
  replace('u004e', 'N').	
  replace('u004f', 'O').	
  replace('u0050', 'P').	
  replace('u0051', 'Q').	
  replace('u0052', 'R').	
  replace('u0053', 'S').	
  replace('u0054', 'T').	
  replace('u0055', 'U').	
  replace('u0056', 'V').	
  replace('u0057', 'W').	
  replace('u0058', 'X').	
  replace('u0059', 'Y').	
  replace('u005a', 'Z').	
  replace('u005b', '[').	
  replace('u005d', ']').	
  replace('u005e', '^').	
  replace('u005f', '_').	
  replace('u0060', '`').	
  replace('u0061', 'a').	
  replace('u0062', 'b').	
  replace('u0063', 'c').	
  replace('u0064', 'd').	
  replace('u0065', 'e').	
  replace('u0066', 'f').	
  replace('u0067', 'g').	
  replace('u0068', 'h').	
  replace('u0069', 'i').	
  replace('u006a', 'j').	
  replace('u006b', 'k').	
  replace('u006c', 'l').	
  replace('u006d', 'm').	
  replace('u006e', 'n').	
  replace('u006f', 'o').	
  replace('u0070', 'p').	
  replace('u0071', 'q').	
  replace('u0072', 'r').	
  replace('u0073', 's').	
  replace('u0074', 't').	
  replace('u0075', 'u').	
  replace('u0076', 'v').	
  replace('u0077', 'w').	
  replace('u0078', 'x').	
  replace('u0079', 'y').	
  replace('u007a', 'z').	
  replace('u007b', '{').	
  replace('u007c', '|').	
  replace('u007d', '}').	
  replace('u007e', '~').	
  replace('u00a0', ' ').	
  replace('u00a1', '¡').	
  replace('u00a2', '¢').	
  replace('u00a3', '£').	
  replace('u00a4', '¤').	
  replace('u00a5', '¥').	
  replace('u00a6', '¦').	
  replace('u00a7', '§').	
  replace('u00a8', '¨').	
  replace('u00a9', '©').	
  replace('u00aa', 'ª').	
  replace('u00ab', '«').	
  replace('u00ac', '¬').	
  replace('u00ad', '').	
  replace('u00ae', '®').	
  replace('u00af', '¯').	
  replace('u00b0', '°').	
  replace('u00b1', '±').	
  replace('u00b2', '²').	
  replace('u00b3', '³').	
  replace('u00b4', '´').	
  replace('u00b5', 'µ').	
  replace('u00b6', '¶').	
  replace('u00b7', '·').	
  replace('u00b8', '¸').	
  replace('u00b9', '¹').	
  replace('u00ba', 'º').	
  replace('u00bb', '»').	
  replace('u00bc', '¼').	
  replace('u00bd', '½').	
  replace('u00be', '¾').	
  replace('u00bf', '¿').	
  replace('u00c0', 'À').	
  replace('u00c1', 'Á').	
  replace('u00c2', 'Â').	
  replace('u00c3', 'Ã').	
  replace('u00c4', 'Ä').	
  replace('u00c5', 'Å').	
  replace('u00c6', 'Æ').	
  replace('u00c7', 'Ç').	
  replace('u00c8', 'È').	
  replace('u00c9', 'É').	
  replace('u00ca', 'Ê').	
  replace('u00cb', 'Ë').	
  replace('u00cc', 'Ì').	
  replace('u00cd', 'Í').	
  replace('u00ce', 'Î').	
  replace('u00cf', 'Ï').	
  replace('u00d0', 'Ð').	
  replace('u00d1', 'Ñ').	
  replace('u00d2', 'Ò').	
  replace('u00d3', 'Ó').	
  replace('u00d4', 'Ô').	
  replace('u00d5', 'Õ').	
  replace('u00d6', 'Ö').	
  replace('u00d7', '×').	
  replace('u00d8', 'Ø').	
  replace('u00d9', 'Ù').	
  replace('u00da', 'Ú').	
  replace('u00db', 'Û').	
  replace('u00dc', 'Ü').	
  replace('u00dd', 'Ý').	
  replace('u00de', 'Þ').	
  replace('u00df', 'ß').	
  replace('u00e0', 'à').	
  replace('u00e1', 'á').	
  replace('u00e2', 'â').	
  replace('u00e3', 'ã').	
  replace('u00e4', 'ä').	
  replace('u00e5', 'å').	
  replace('u00e6', 'æ').	
  replace('u00e7', 'ç').	
  replace('u00e8', 'è').	
  replace('u00e9', 'é').	
  replace('u00ea', 'ê').	
  replace('u00eb', 'ë').	
  replace('u00ec', 'ì').	
  replace('u00ed', 'í').	
  replace('u00ee', 'î').	
  replace('u00ef', 'ï').	
  replace('u00f0', 'ð').	
  replace('u00f1', 'ñ').	
  replace('u00f2', 'ò').	
  replace('u00f3', 'ó').	
  replace('u00f4', 'ô').	
  replace('u00f5', 'õ').	
  replace('u00f6', 'ö').	
  replace('u00f7', '÷').	
  replace('u00f8', 'ø').	
  replace('u00f9', 'ù').	
  replace('u0e1b', 'ป').	
  replace('u0e30', 'ะ').	
  replace('u0e40', 'เ').	
  replace('u0e27', 'ว').	
  replace('u0e28', 'ศ').	
  replace('u4e0a', '上').	
  replace('u6d77', 'u0e1b').	
  replace('u0e30', 'u0e1b').	
  replace('u0e30', 'u0e1b').	
  replace('u0e30', 'u0e1b').	
  replace('u0e30', 'u0e1b')
}

var sanitize2 = function (str) {
  return str.	
  replace('u00fa', 'ú').	
  replace('u00fb', 'û').	
  replace('u00fc', 'ü').	
  replace('u00fd', 'ý').	
  replace('u00fe', 'þ').	
  replace('u00ff', 'ÿ').	
  replace('u0100', 'Ā').	
  replace('u0101', 'ā').	
  replace('u0102', 'Ă').	
  replace('u0103', 'ă').	
  replace('u0104', 'Ą').	
  replace('u0105', 'ą').	
  replace('u0106', 'Ć').	
  replace('u0107', 'ć').	
  replace('u0108', 'Ĉ').	
  replace('u0109', 'ĉ').	
  replace('u010a', 'Ċ').	
  replace('u010b', 'ċ').	
  replace('u010c', 'Č').	
  replace('u010d', 'č').	
  replace('u010e', 'Ď').	
  replace('u010f', 'ď').	
  replace('u0110', 'Đ').	
  replace('u0111', 'đ').	
  replace('u0112', 'Ē').	
  replace('u0113', 'ē').	
  replace('u0114', 'Ĕ').	
  replace('u0115', 'ĕ').	
  replace('u0116', 'Ė').	
  replace('u0117', 'ė').	
  replace('u0118', 'Ę').	
  replace('u0119', 'ę').	
  replace('u011a', 'Ě').	
  replace('u011b', 'ě').	
  replace('u011c', 'Ĝ').	
  replace('u011d', 'ĝ').	
  replace('u011e', 'Ğ').	
  replace('u011f', 'ğ').	
  replace('u0120', 'Ġ').	
  replace('u0121', 'ġ').	
  replace('u0122', 'Ģ').	
  replace('u0123', 'ģ').	
  replace('u0124', 'Ĥ').	
  replace('u0125', 'ĥ').	
  replace('u0126', 'Ħ').	
  replace('u0127', 'ħ').	
  replace('u0128', 'Ĩ').	
  replace('u0129', 'ĩ').	
  replace('u012a', 'Ī').	
  replace('u012b', 'ī').	
  replace('u012c', 'Ĭ').	
  replace('u012d', 'ĭ').	
  replace('u012e', 'Į').	
  replace('u012f', 'į').	
  replace('u0130', 'İ').	
  replace('u0131', 'ı').	
  replace('u0132', 'Ĳ').	
  replace('u0133', 'ĳ').	
  replace('u0134', 'Ĵ').	
  replace('u0135', 'ĵ').	
  replace('u0136', 'Ķ').	
  replace('u0137', 'ķ').	
  replace('u0138', 'ĸ').	
  replace('u0139', 'Ĺ').	
  replace('u013a', 'ĺ').	
  replace('u013b', 'Ļ').	
  replace('u013c', 'ļ').	
  replace('u013d', 'Ľ').	
  replace('u013e', 'ľ').	
  replace('u013f', 'Ŀ').	
  replace('u0140', 'ŀ').	
  replace('u0141', 'Ł').	
  replace('u0142', 'ł').	
  replace('u0143', 'Ń').	
  replace('u0144', 'ń').	
  replace('u0145', 'Ņ').	
  replace('u0146', 'ņ').	
  replace('u0147', 'Ň').	
  replace('u0148', 'ň').	
  replace('u0149', 'ŉ').	
  replace('u014a', 'Ŋ').	
  replace('u014b', 'ŋ').	
  replace('u014c', 'Ō').	
  replace('u014d', 'ō').	
  replace('u014e', 'Ŏ').	
  replace('u014f', 'ŏ').	
  replace('u0150', 'Ő').	
  replace('u0151', 'ő').	
  replace('u0152', 'Œ').	
  replace('u0153', 'œ').	
  replace('u0154', 'Ŕ').	
  replace('u0155', 'ŕ').	
  replace('u0156', 'Ŗ').	
  replace('u0157', 'ŗ').	
  replace('u0158', 'Ř').	
  replace('u0159', 'ř').	
  replace('u015a', 'Ś').	
  replace('u015b', 'ś').	
  replace('u015c', 'Ŝ').	
  replace('u015d', 'ŝ').	
  replace('u015e', 'Ş').	
  replace('u015f', 'ş').	
  replace('u0160', 'Š').	
  replace('u0161', 'š').	
  replace('u0162', 'Ţ').	
  replace('u0163', 'ţ').	
  replace('u0164', 'Ť').	
  replace('u0165', 'ť').	
  replace('u0166', 'Ŧ').	
  replace('u0167', 'ŧ').	
  replace('u0168', 'Ũ').	
  replace('u0169', 'ũ').	
  replace('u016a', 'Ū').	
  replace('u016b', 'ū').	
  replace('u016c', 'Ŭ').	
  replace('u016d', 'ŭ').	
  replace('u016e', 'Ů').	
  replace('u016f', 'ů').	
  replace('u0170', 'Ű').	
  replace('u0171', 'ű').	
  replace('u0172', 'Ų').	
  replace('u0173', 'ų').	
  replace('u0174', 'Ŵ').	
  replace('u0175', 'ŵ').	
  replace('u0176', 'Ŷ').	
  replace('u0177', 'ŷ').	
  replace('u0178', 'Ÿ').	
  replace('u0179', 'Ź').	
  replace('u017a', 'ź').	
  replace('u017b', 'Ż').	
  replace('u017c', 'ż').	
  replace('u017d', 'Ž').	
  replace('u017e', 'ž').	
  replace('u017f', 'ſ').	
  replace('u0180', 'ƀ').	
  replace('u0181', 'Ɓ').	
  replace('u0182', 'Ƃ').	
  replace('u0183', 'ƃ').	
  replace('u0184', 'Ƅ').	
  replace('u0185', 'ƅ').	
  replace('u0186', 'Ɔ').	
  replace('u0187', 'Ƈ').	
  replace('u0188', 'ƈ').	
  replace('u0189', 'Ɖ').	
  replace('u018a', 'Ɗ').	
  replace('u018b', 'Ƌ').	
  replace('u018c', 'ƌ').	
  replace('u018d', 'ƍ').	
  replace('u018e', 'Ǝ').	
  replace('u018f', 'Ə').	
  replace('u0190', 'Ɛ').	
  replace('u0191', 'Ƒ').	
  replace('u0192', 'ƒ').	
  replace('u0193', 'Ɠ').	
  replace('u0194', 'Ɣ').	
  replace('u0195', 'ƕ').	
  replace('u0196', 'Ɩ').	
  replace('u0197', 'Ɨ').	
  replace('u0198', 'Ƙ').	
  replace('u0199', 'ƙ').	
  replace('u019a', 'ƚ').	
  replace('u019b', 'ƛ').	
  replace('u019c', 'Ɯ').	
  replace('u019d', 'Ɲ').	
  replace('u019e', 'ƞ').	
  replace('u019f', 'Ɵ').	
  replace('u01a0', 'Ơ').	
  replace('u01a1', 'ơ').	
  replace('u01a2', 'Ƣ').	
  replace('u01a3', 'ƣ').	
  replace('u01a4', 'Ƥ').	
  replace('u01a5', 'ƥ').	
  replace('u01a6', 'Ʀ').	
  replace('u01a7', 'Ƨ').	
  replace('u01a8', 'ƨ').	
  replace('u01a9', 'Ʃ').	
  replace('u01aa', 'ƪ').	
  replace('u01ab', 'ƫ').	
  replace('u01ac', 'Ƭ').	
  replace('u01ad', 'ƭ').	
  replace('u01ae', 'Ʈ').	
  replace('u01af', 'Ư').	
  replace('u01b0', 'ư').	
  replace('u01b1', 'Ʊ').	
  replace('u01b2', 'Ʋ').	
  replace('u01b3', 'Ƴ').	
  replace('u01b4', 'ƴ').	
  replace('u01b5', 'Ƶ').	
  replace('u01b6', 'ƶ').	
  replace('u01b7', 'Ʒ').	
  replace('u01b8', 'Ƹ').	
  replace('u01b9', 'ƹ').	
  replace('u01ba', 'ƺ').	
  replace('u01bb', 'ƻ')
}

var sanitize3 = function (str) {
  return str.	
  replace('u01bc', 'Ƽ').	
  replace('u01bd', 'ƽ').	
  replace('u01be', 'ƾ').	
  replace('u01bf', 'ƿ').	
  replace('u01c0', 'ǀ').	
  replace('u01c1', 'ǁ').	
  replace('u01c2', 'ǂ').	
  replace('u01c3', 'ǃ').	
  replace('u01c4', 'Ǆ').	
  replace('u01c5', 'ǅ').	
  replace('u01c6', 'ǆ').	
  replace('u01c7', 'Ǉ').	
  replace('u01c8', 'ǈ').	
  replace('u01c9', 'ǉ').	
  replace('u01ca', 'Ǌ').	
  replace('u01cb', 'ǋ').	
  replace('u01cc', 'ǌ').	
  replace('u01cd', 'Ǎ').	
  replace('u01ce', 'ǎ').	
  replace('u01cf', 'Ǐ').	
  replace('u01d0', 'ǐ').	
  replace('u01d1', 'Ǒ').	
  replace('u01d2', 'ǒ').	
  replace('u01d3', 'Ǔ').	
  replace('u01d4', 'ǔ').	
  replace('u01d5', 'Ǖ').	
  replace('u01d6', 'ǖ').	
  replace('u01d7', 'Ǘ').	
  replace('u01d8', 'ǘ').	
  replace('u01d9', 'Ǚ').	
  replace('u01da', 'ǚ').	
  replace('u01db', 'Ǜ').	
  replace('u01dc', 'ǜ').	
  replace('u01dd', 'ǝ').	
  replace('u01de', 'Ǟ').	
  replace('u01df', 'ǟ').	
  replace('u01e0', 'Ǡ').	
  replace('u01e1', 'ǡ').	
  replace('u01e2', 'Ǣ').	
  replace('u01e3', 'ǣ').	
  replace('u01e4', 'Ǥ').	
  replace('u01e5', 'ǥ').	
  replace('u01e6', 'Ǧ').	
  replace('u01e7', 'ǧ').	
  replace('u01e8', 'Ǩ').	
  replace('u01e9', 'ǩ').	
  replace('u01ea', 'Ǫ').	
  replace('u01eb', 'ǫ').	
  replace('u01ec', 'Ǭ').	
  replace('u01ed', 'ǭ').	
  replace('u01ee', 'Ǯ').	
  replace('u01ef', 'ǯ').	
  replace('u01f0', 'ǰ').	
  replace('u01f1', 'Ǳ').	
  replace('u01f2', 'ǲ').	
  replace('u01f3', 'ǳ').	
  replace('u01f4', 'Ǵ').	
  replace('u01f5', 'ǵ').	
  replace('u01f6', 'Ƕ').	
  replace('u01f7', 'Ƿ').	
  replace('u01f8', 'Ǹ').	
  replace('u01f9', 'ǹ').	
  replace('u01fa', 'Ǻ').	
  replace('u01fb', 'ǻ').	
  replace('u01fc', 'Ǽ').	
  replace('u01fd', 'ǽ').	
  replace('u01fe', 'Ǿ').	
  replace('u01ff', 'ǿ').	
  replace('u0200', 'Ȁ').	
  replace('u0201', 'ȁ').	
  replace('u0202', 'Ȃ').	
  replace('u0203', 'ȃ').	
  replace('u0204', 'Ȅ').	
  replace('u0205', 'ȅ').	
  replace('u0206', 'Ȇ').	
  replace('u0207', 'ȇ').	
  replace('u0208', 'Ȉ').	
  replace('u0209', 'ȉ').	
  replace('u020a', 'Ȋ').	
  replace('u020b', 'ȋ').	
  replace('u020c', 'Ȍ').	
  replace('u020d', 'ȍ').	
  replace('u020e', 'Ȏ').	
  replace('u020f', 'ȏ').	
  replace('u0210', 'Ȑ').	
  replace('u0211', 'ȑ').	
  replace('u0212', 'Ȓ').	
  replace('u0213', 'ȓ').	
  replace('u0214', 'Ȕ').	
  replace('u0215', 'ȕ').	
  replace('u0216', 'Ȗ').	
  replace('u0217', 'ȗ').	
  replace('u0218', 'Ș').	
  replace('u0219', 'ș').	
  replace('u021a', 'Ț').	
  replace('u021b', 'ț').	
  replace('u021c', 'Ȝ').	
  replace('u021d', 'ȝ').	
  replace('u021e', 'Ȟ').	
  replace('u021f', 'ȟ').	
  replace('u0220', 'Ƞ').	
  replace('u0221', 'ȡ').	
  replace('u0222', 'Ȣ').	
  replace('u0223', 'ȣ').	
  replace('u0224', 'Ȥ').	
  replace('u0225', 'ȥ').	
  replace('u0226', 'Ȧ').	
  replace('u0227', 'ȧ').	
  replace('u0228', 'Ȩ').	
  replace('u0229', 'ȩ').	
  replace('u022a', 'Ȫ').	
  replace('u022b', 'ȫ').	
  replace('u022c', 'Ȭ').	
  replace('u022d', 'ȭ').	
  replace('u022e', 'Ȯ').	
  replace('u022f', 'ȯ').	
  replace('u0230', 'Ȱ').	
  replace('u0231', 'ȱ').	
  replace('u0232', 'Ȳ').	
  replace('u0233', 'ȳ').	
  replace('u0234', 'ȴ').	
  replace('u0235', 'ȵ').	
  replace('u0236', 'ȶ').	
  replace('u0237', 'ȷ').	
  replace('u0238', 'ȸ').	
  replace('u0239', 'ȹ').	
  replace('u023a', 'Ⱥ').	
  replace('u023b', 'Ȼ').	
  replace('u023c', 'ȼ').	
  replace('u023d', 'Ƚ').	
  replace('u023e', 'Ⱦ').	
  replace('u023f', 'ȿ').	
  replace('u0240', 'ɀ').	
  replace('u0241', 'Ɂ').	
  replace('u0242', 'ɂ').	
  replace('u0243', 'Ƀ').	
  replace('u0244', 'Ʉ').	
  replace('u0245', 'Ʌ').	
  replace('u0246', 'Ɇ').	
  replace('u0247', 'ɇ').	
  replace('u0248', 'Ɉ').	
  replace('u024a', 'Ɋ').	
  replace('u024b', 'ɋ').	
  replace('u024c', 'Ɍ').	
  replace('u024d', 'ɍ').	
  replace('u024e', 'Ɏ').	
  replace('u024f', 'ɏ').	
  replace('u011b', 'ě').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø').	
  replace('u00f8', 'ø');
}

var sanitize4 = function (str) {
  return str.	
  replace('u0370', 'Ͱ').
  replace('u0371', 'ͱ').
  replace('u0372', 'Ͳ').
  replace('u0373', 'ͳ').
  replace('u0374', 'ʹ').
  replace('u0375', '͵').
  replace('u0376', 'Ͷ').
  replace('u0377', 'ͷ').
  replace('u037A', 'ͺ').
  replace('u037B', 'ͻ').
  replace('u037C', 'ͼ').
  replace('u037D', 'ͽ').
  replace('u037E', ';').
  replace('u0384', '΄').
  replace('u0385', '΅').
  replace('u0386', 'Ά').
  replace('u0387', '·').
  replace('u0388', 'Έ').
  replace('u0389', 'Ή').
  replace('u038A', 'Ί').
  replace('u038C', 'Ό').
  replace('u038E', 'Ύ').
  replace('u038F', 'Ώ').
  replace('u0390', 'ΐ').
  replace('u0391', 'Α').
  replace('u0392', 'Β').
  replace('u0393', 'Γ').
  replace('u0394', 'Δ').
  replace('u0395', 'Ε').
  replace('u0396', 'Ζ').
  replace('u0397', 'Η').
  replace('u0398', 'Θ').
  replace('u0399', 'Ι').
  replace('u039A', 'Κ').
  replace('u039B', 'Λ').
  replace('u039C', 'Μ').
  replace('u039D', 'Ν').
  replace('u039E', 'Ξ').
  replace('u039F', 'Ο').
  replace('u03A0', 'Π').
  replace('u03A1', 'Ρ').
  replace('u03A3', 'Σ').
  replace('u03A4', 'Τ').
  replace('u03A5', 'Υ').
  replace('u03A6', 'Φ').
  replace('u03A7', 'Χ').
  replace('u03A8', 'Ψ').
  replace('u03A9', 'Ω').
  replace('u03AA', 'Ϊ').
  replace('u03AB', 'Ϋ').
  replace('u03AC', 'ά').
  replace('u03AD', 'έ').
  replace('u03AE', 'ή').
  replace('u03AF', 'ί').
  replace('u03B0', 'ΰ').
  replace('u03B1', 'α').
  replace('u03B2', 'β').
  replace('u03B3', 'γ').
  replace('u03B4', 'δ').
  replace('u03B5', 'ε').
  replace('u03B6', 'ζ').
  replace('u03B7', 'η').
  replace('u03B8', 'θ').
  replace('u03B9', 'ι').
  replace('u03BA', 'κ').
  replace('u03BB', 'λ').
  replace('u03BC', 'μ').
  replace('u03BD', 'ν').
  replace('u03BE', 'ξ').
  replace('u03BF', 'ο').
  replace('u03C0', 'π').
  replace('u03C1', 'ρ').
  replace('u03C2', 'ς').
  replace('u03C3', 'σ').
  replace('u03C4', 'τ').
  replace('u03C5', 'υ').
  replace('u03C6', 'φ').
  replace('u03C7', 'χ').
  replace('u03C8', 'ψ').
  replace('u03C9', 'ω').
  replace('u03CA', 'ϊ').
  replace('u03CB', 'ϋ').
  replace('u03CC', 'ό').
  replace('u03CD', 'ύ').
  replace('u03CE', 'ώ').
  replace('u03CF', 'Ϗ').
  replace('u03D0', 'ϐ').
  replace('u03D1', 'ϑ').
  replace('u03D2', 'ϒ').
  replace('u03D3', 'ϓ').
  replace('u03D4', 'ϔ').
  replace('u03D5', 'ϕ').
  replace('u03D6', 'ϖ').
  replace('u03D7', 'ϗ').
  replace('u03D8', 'Ϙ').
  replace('u03D9', 'ϙ').
  replace('u03DA', 'Ϛ').
  replace('u03DB', 'ϛ').
  replace('u03DC', 'Ϝ').
  replace('u03DD', 'ϝ').
  replace('u03DE', 'Ϟ').
  replace('u03DF', 'ϟ').
  replace('u03E0', 'Ϡ').
  replace('u03E1', 'ϡ').
  replace('u03E2', 'Ϣ').
  replace('u03E3', 'ϣ').
  replace('u03E4', 'Ϥ').
  replace('u03E5', 'ϥ').
  replace('u03E6', 'Ϧ').
  replace('u03E7', 'ϧ').
  replace('u03E8', 'Ϩ').
  replace('u03E9', 'ϩ').
  replace('u03EA', 'Ϫ').
  replace('u03EB', 'ϫ').
  replace('u03EC', 'Ϭ').
  replace('u03ED', 'ϭ').
  replace('u03EE', 'Ϯ').
  replace('u03EF', 'ϯ').
  replace('u03F0', 'ϰ').
  replace('u03F1', 'ϱ').
  replace('u03F2', 'ϲ').
  replace('u03F3', 'ϳ').
  replace('u03F4', 'ϴ').
  replace('u03F5', 'ϵ').
  replace('u03F6', '϶').
  replace('u03F7', 'Ϸ').
  replace('u03F8', 'ϸ').
  replace('u03F9', 'Ϲ').
  replace('u03FA', 'Ϻ').
  replace('u03FB', 'ϻ').
  replace('u03FC', 'ϼ').
  replace('u03FD', 'Ͻ').
  replace('u03FE', 'Ͼ').
  replace('u03FF', 'Ͽ').
  replace('u0400', 'Ѐ').
  replace('u0401', 'Ё').
  replace('u0402', 'Ђ').
  replace('u0403', 'Ѓ').
  replace('u0404', 'Є').
  replace('u0405', 'Ѕ').
  replace('u0406', 'І').
  replace('u0407', 'Ї').
  replace('u0408', 'Ј').
  replace('u0409', 'Љ').
  replace('u040A', 'Њ').
  replace('u040B', 'Ћ').
  replace('u040C', 'Ќ').
  replace('u040D', 'Ѝ').
  replace('u040E', 'Ў').
  replace('u040F', 'Џ').
  replace('u0410', 'А').
  replace('u0411', 'Б').
  replace('u0412', 'В').
  replace('u0413', 'Г').
  replace('u0414', 'Д').
  replace('u0415', 'Е').
  replace('u0416', 'Ж').
  replace('u0417', 'З').
  replace('u0418', 'И').
  replace('u0419', 'Й').
  replace('u041A', 'К').
  replace('u041B', 'Л').
  replace('u041C', 'М').
  replace('u041D', 'Н').
  replace('u041E', 'О').
  replace('u041F', 'П').
  replace('u0420', 'Р').
  replace('u0421', 'С').
  replace('u0422', 'Т').
  replace('u0423', 'У').
  replace('u0424', 'Ф').
  replace('u0425', 'Х').
  replace('u0426', 'Ц').
  replace('u0427', 'Ч').
  replace('u0428', 'Ш').
  replace('u0429', 'Щ').
  replace('u042A', 'Ъ').
  replace('u042B', 'Ы').
  replace('u042C', 'Ь').
  replace('u042D', 'Э').
  replace('u042E', 'Ю').
  replace('u042F', 'Я').
  replace('u0430', 'а').
  replace('u0431', 'б').
  replace('u0432', 'в').
  replace('u0433', 'г').
  replace('u0434', 'д').
  replace('u0435', 'е').
  replace('u0436', 'ж').
  replace('u0437', 'з').
  replace('u0438', 'и').
  replace('u0439', 'й').
  replace('u043A', 'к').
  replace('u043B', 'л').
  replace('u043C', 'м').
  replace('u043D', 'н').
  replace('u043E', 'о').
  replace('u043F', 'п').
  replace('u0440', 'р').
  replace('u0441', 'с').
  replace('u0442', 'т').
  replace('u0443', 'у').
  replace('u0444', 'ф').
  replace('u0445', 'х').
  replace('u0446', 'ц').
  replace('u0447', 'ч').
  replace('u0448', 'ш').
  replace('u0449', 'щ').
  replace('u044A', 'ъ').
  replace('u044B', 'ы').
  replace('u044C', 'ь').
  replace('u044D', 'э').
  replace('u044E', 'ю').
  replace('u044F', 'я').
  replace('u0450', 'ѐ').
  replace('u0451', 'ё').
  replace('u0452', 'ђ').
  replace('u0453', 'ѓ').
  replace('u0454', 'є').
  replace('u0455', 'ѕ').
  replace('u0456', 'і').
  replace('u0457', 'ї').
  replace('u0458', 'ј').
  replace('u0459', 'љ').
  replace('u045A', 'њ').
  replace('u045B', 'ћ').
  replace('u045C', 'ќ').
  replace('u045D', 'ѝ').
  replace('u045E', 'ў').
  replace('u045F', 'џ').
  replace('u0460', 'Ѡ').
  replace('u0461', 'ѡ').
  replace('u0462', 'Ѣ').
  replace('u0463', 'ѣ').
  replace('u0464', 'Ѥ').
  replace('u0465', 'ѥ').
  replace('u0466', 'Ѧ').
  replace('u0467', 'ѧ').
  replace('u0468', 'Ѩ').
  replace('u0469', 'ѩ').
  replace('u046A', 'Ѫ').
  replace('u046B', 'ѫ').
  replace('u046C', 'Ѭ').
  replace('u046D', 'ѭ').
  replace('u046E', 'Ѯ').
  replace('u046F', 'ѯ');
}

var sanitize5 = function (str) {
  return str.	
  replace('u0E00', '฀').
  replace('u0E01', 'ก').
  replace('u0E02', 'ข').
  replace('u0E03', 'ฃ').
  replace('u0E04', 'ค').
  replace('u0E05', 'ฅ').
  replace('u0E06', 'ฆ').
  replace('u0E07', 'ง').
  replace('u0E08', 'จ').
  replace('u0E09', 'ฉ').
  replace('u0E0A', 'ช').
  replace('u0E0B', 'ซ').
  replace('u0E0C', 'ฌ').
  replace('u0E0D', 'ญ').
  replace('u0E0E', 'ฎ').
  replace('u0E0F', 'ฏ').
  replace('u0E10', 'ฐ').
  replace('u0E11', 'ฑ').
  replace('u0E12', 'ฒ').
  replace('u0E13', 'ณ').
  replace('u0E14', 'ด').
  replace('u0E15', 'ต').
  replace('u0E16', 'ถ').
  replace('u0E17', 'ท').
  replace('u0E18', 'ธ').
  replace('u0E19', 'น').
  replace('u0E1A', 'บ').
  replace('u0E1B', 'ป').
  replace('u0E1C', 'ผ').
  replace('u0E1D', 'ฝ').
  replace('u0E1E', 'พ').
  replace('u0E1F', 'ฟ').
  replace('u0E20', 'ภ').
  replace('u0E21', 'ม').
  replace('u0E22', 'ย').
  replace('u0E23', 'ร').
  replace('u0E24', 'ฤ').
  replace('u0E25', 'ล').
  replace('u0E26', 'ฦ').
  replace('u0E27', 'ว').
  replace('u0E28', 'ศ').
  replace('u0E29', 'ษ').
  replace('u0E2A', 'ส').
  replace('u0E2B', 'ห').
  replace('u0E2C', 'ฬ').
  replace('u0E2D', 'อ').
  replace('u0E2E', 'ฮ').
  replace('u0E2F', 'ฯ').
  replace('u0E30', 'ะ').
  replace('u0E31', 'ั').
  replace('u0E32', 'า').
  replace('u0E33', 'ำ').
  replace('u0E34', 'ิ').
  replace('u0E35', 'ี').
  replace('u0E36', 'ึ').
  replace('u0E37', 'ื').
  replace('u0E38', 'ุ').
  replace('u0E39', 'ู').
  replace('u0E3A', 'ฺ').
  replace('u0E3F', '฿').
  replace('u0E40', 'เ').
  replace('u0E41', 'แ').
  replace('u0E42', 'โ').
  replace('u0E43', 'ใ').
  replace('u0E44', 'ไ').
  replace('u0E45', 'ๅ').
  replace('u0E46', 'ๆ').
  replace('u0E47', '็').
  replace('u0E48', '่').
  replace('u0E49', '้').
  replace('u0E4A', '๊').
  replace('u0E4B', '๋').
  replace('u0E4C', '์').
  replace('u0E4D', 'ํ').
  replace('u0E4E', '๎').
  replace('u0E4F', '๏').
  replace('u0E50', '๐').
  replace('u0E51', '๑').
  replace('u0E52', '๒').
  replace('u0E53', '๓').
  replace('u0E54', '๔').
  replace('u0E55', '๕').
  replace('u0E56', '๖').
  replace('u0E57', '๗').
  replace('u0E58', '๘').
  replace('u0E59', '๙').
  replace('u0E5A', '๚').
  replace('u0E5B', '๛');
}

var sanitize6 = function (str) {
  return str.	
  replace('u0370', 'Ͱ').
  replace('u0410', 'А').
  replace('u0430', 'а').
  replace('u0411', 'Б').
  replace('u0431', 'б').
  replace('u0412', 'В').
  replace('u0432', 'в').
  replace('u0413', 'Г').
  replace('u0433', 'г').
  replace('u0490', 'Ґ').
  replace('u0491', 'ґ').
  replace('u0414', 'Д').
  replace('u0434', 'д').
  replace('u0415', 'Е').
  replace('u0454', 'е').
  replace('u0435', 'Є').
  replace('u0404', 'є').
  replace('u0416', 'Ж').
  replace('u0436', 'ж').
  replace('u0417', 'З').
  replace('u0437', 'з').
  replace('u0418', 'И').
  replace('u0438', 'и').
  replace('u0406', 'І').
  replace('u0456', 'і').
  replace('u0407', 'Ї').
  replace('u0457', 'ї').
  replace('u0419', 'Й').
  replace('u0439', 'й').
  replace('u041a', 'К').
  replace('u043a', 'к').
  replace('u041b', 'Л').
  replace('u043b', 'л').
  replace('u041c', 'М').
  replace('u043c', 'м').
  replace('u041d', 'Н').
  replace('u043d', 'н').
  replace('u041e', 'О').
  replace('u043e', 'о').
  replace('u041f', 'П').
  replace('u043f', 'п').
  replace('u0420', 'Р').
  replace('u0440', 'р').
  replace('u0421', 'С').
  replace('u0441', 'с').
  replace('u0422', 'Т').
  replace('u0442', 'т').
  replace('u0423', 'У').
  replace('u0443', 'у').
  replace('u0424', 'Ф').
  replace('u0444', 'ф').
  replace('u0425', 'Х').
  replace('u0445', 'х').
  replace('u0426', 'Ц').
  replace('u0446', 'ц').
  replace('u0427', 'Ч').
  replace('u0447', 'ч').
  replace('u0428', 'Ш').
  replace('u0448', 'ш').
  replace('u0429', 'Щ').
  replace('u0449', 'щ').
  replace('u042c', 'Ь').
  replace('u044c', 'ь').
  replace('u042e', 'Ю').
  replace('u044e', 'ю').
  replace('u042f', 'Я').
  replace('u044f', 'я').
  replace('u4E00', '一').
  replace('u4E01', '丁').
  replace('u4E02', '丂').
  replace('u4E03', '七').
  replace('u4E04', '丄').
  replace('u4E05', '丅').
  replace('u4E06', '丆').
  replace('u4E07', '万').
  replace('u4E08', '丈').
  replace('u4E09', '三').
  replace('u4E0A', '上').
  replace('u4E0B', '下').
  replace('u4E0C', '丌').
  replace('u4E0D', '不').
  replace('u4E0E', '与').
  replace('u4E0F', '丏').
  replace('u4E10', '丐').
  replace('u4E11', '丑').
  replace('u4E12', '丒').
  replace('u4E13', '专').
  replace('u4E14', '且').
  replace('u4E15', '丕').
  replace('u4E16', '世').
  replace('u4E17', '丗').
  replace('u4E18', '丘').
  replace('u4E19', '丙').
  replace('u4E1A', '业').
  replace('u4E1B', '丛').
  replace('u4E1C', '东').
  replace('u4E1D', '丝').
  replace('u4E1E', '丞').
  replace('u4E1F', '丟').
  replace('u4E20', '丠').
  replace('u4E21', '両').
  replace('u4E22', '丢').
  replace('u4E23', '丣').
  replace('u4E24', '两').
  replace('u4E25', '严').
  replace('u4E26', '並').
  replace('u4E27', '丧').
  replace('u4E28', '丨').
  replace('u4E29', '丩').
  replace('u4E2A', '个').
  replace('u4E2B', '丫').
  replace('u4E2C', '丬').
  replace('u4E2D', '中').
  replace('u4E2E', '丮').
  replace('u4E2F', '丯').
  replace('u4E30', '丰').
  replace('u4E31', '丱').
  replace('u4E32', '串').
  replace('u4E33', '丳').
  replace('u4E34', '临').
  replace('u4E35', '丵').
  replace('u4E36', '丶').
  replace('u4E37', '丷').
  replace('u4E38', '丸').
  replace('u4E39', '丹').
  replace('u4E3A', '为').
  replace('u4E3B', '主').
  replace('u4E3C', '丼').
  replace('u4E3D', '丽').
  replace('u4E3E', '举').
  replace('u0370', 'Ͱ').
  replace('u4e0a', '上').
  replace('u6d77', '海').
  replace('u5317', '北').
  replace('u4eac', '京').
  replace('u5357', '南').
  replace('u4eac', '京').
  replace('u53a6', '厦').
  replace('u95e8', '门').
  replace('u5609', '嘉').
  replace('u5174', '兴').
  replace('u592a', '太').
  replace('u539f', '原').
  replace('u5ba3', '宣').
  replace('u6b66', '武').
  replace('u5e7f', '广').
  replace('u5dde', '州').
  replace('u6210', '成').
  replace('u90fd', '都').
  replace('u6625', '春').
  replace('u65e5', '日').
  replace('u90e8', '部').
  replace('u5e02', '市').
  replace('u6b66', '武').
  replace('u6c49', '汉').
  replace('u6c55', '汕').
  replace('u5934', '头').
  replace('u6c5f', '江').
  replace('u82cf', '苏').
  replace('u6c88', '沈').
  replace('u9633', '阳').
  replace('u6d1b', '洛').
  replace('u6749', '杉').
  replace('u77f6', '矶').
  replace('u6d1b', '洛').
  replace('u6749', '杉').
  replace('u77f6', '矶').
  replace('u6d59', '浙').
  replace('u6c5f', '江').
  replace('u6d59', '浙').
  replace('u6c5f', '江').
  replace('u7ecd', '绍').
  replace('u5174', '兴').
  replace('u6e29', '温').
  replace('u5dde', '州').
  replace('u8944', '襄').
  replace('u9633', '阳').
  replace('u897f', '西').
  replace('u5b89', '安').
  replace('u8fbd', '辽').
  replace('u5b81', '宁').
  replace('u6c88', '沈').
  replace('u9633', '阳').
  replace('u90d1', '郑').
  replace('u5dde', '州').
  replace('u91cd', '重').
  replace('u5e86', '庆').
  replace('u4E3F', '丿');
}
db.users.find({"addresses.locality": {$exists: true}},{addresses: 1}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality) {
        e.addresses[a].locality = sanitize(sanitize2(sanitize3(sanitize4(sanitize5(sanitize6(e.addresses[a].locality))))));
        e.addresses[a].locality = e.addresses[a].locality.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
  }
  db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
});

// cityfix #2
var fix = [
  {country: 'Vietnam', find: 'Hcm', replace: 'Ho Chi Minh'},
  {country: 'Vietnam', find: 'Ho Chi Minh City', replace: 'Ho Chi Minh'},
  {country:'United Kingdom', find:'London', replace:'London'},
  {country:'United Kingdom', find:'london', replace:'London'},
  {country:'Italy', find:'Rome', replace:'Roma'},
  {country:'Italy', find:'Italy', replace:'Roma'},
  {country:'Italy', find:'Milan', replace:'Milano'},
  {country:'Italy', find:'Milani', replace:'Milano'},
  {country:'USA', find:'New York', replace:'New York'},
  {country:'USA', find:'New york', replace:'New York'},
  {country:'USA', find:'new york', replace:'New York'},
  {country:'USA', find:'newyork', replace:'New York'},
  {country:'USA', find:'Newyork', replace:'New York'},
  {country:'USA', find:'New York, Ny 10003', replace:'New York'},
  {country:'USA', find:'New York, NY 10025', replace:'New York'},
  {country:'USA', find:'New York,', replace:'New York'},
  {country:'USA', find:'NEW YORK', replace:'New York'},
  {country:'USA', find:'Newyok', replace:'New York'},
  {country:'USA', find:'New York City', replace:'New York'},
  {country:'USA', find:'New York, Ny', replace:'New York'},
  {country:'USA', find:'New York,', replace:'New York'},
  {country:'USA', find:'New York, Ny 10025', replace:'New York'},
  {country:'USA', find:'New York, Ny 10003', replace:'New York'},
  {country:'Russia', find:'moscow', replace:'Moscow'},
  {country:'Russia', find:'Moscow', replace:'Moscow'},
  {country:'Russia', find:'Moscow Region', replace:'Moscow'},
  {country:'Russia', find:'Moscow ', replace:'Moscow'},
  {country:'Mexico', find:'mexico', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico City', replace:'Mexico City'},
  {country:'Mexico', find:'distrito federal', replace:'Mexico City'},
  {country:'Mexico', find:'DF', replace:'Mexico City'},
  {country:'Mexico', find:'Ciudad de Mu00e9xico', replace:'Mexico City'},
  {country:'Mexico', find:'México City ', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico D.f.', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico, Df', replace:'Mexico City'},
  {country:'Mexico', find:'Cdmx', replace:'Mexico City'},
  {country:'Mexico', find:'C.d.m,x', replace:'Mexico City'},
  {country:'Mexico', find:'Df', replace:'Mexico City'},
  {country:'Mexico', find:'Emxico', replace:'Mexico City'},
  {country:'Mexico', find:'México', replace:'Mexico City'},
  {country:'Mexico', find:'México D.f ', replace:'Mexico City'},
  {country:'Mexico', find:'México D.f', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico Df', replace:'Mexico City'},
  {country:'Mexico', find:'Mex', replace:'Mexico City'},
  {country:'Mexico', find:'Mx', replace:'Mexico City'},
  {country:'Mexico', find:'Ciudad De México', replace:'Mexico City'},
  {country:'Mexico', find:'Cd. De México', replace:'Mexico City'},
  {country:'Mexico', find:'Distrito Federal', replace:'Mexico City'},
  {country:'Mexico', find:'D.f', replace:'Mexico City'},
  {country:'Mexico', find:'D.f.', replace:'Mexico City'},
  {country:'Mexico', find:'México City', replace:'Mexico City'},
  {country:'Mexico', find:'México Df', replace:'Mexico City'},
  {country:'Mexico', find:'Ciudad De Mex', replace:'Mexico City'},
  {country:'Mexico', find:'Ciudad De Mxico', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico Distrito Federal', replace:'Mexico City'},
  {country:'Mexico', find:'Mexico   City', replace:'Mexico City'},
  {country:'Mexico', find:'Mecico City', replace:'Mexico City'},
  {country:'Mexico', find:'Mexicodf', replace:'Mexico City'},
  {country:'Mexico', find:'México D.f.', replace:'Mexico City'},
  {country:'Mexico', find:'México, Df', replace:'Mexico City'},
  {country:'Mexico', find:'México.', replace:'Mexico City'},
  {country:'Mexico', find:'Xalapa,ver', replace:'Xalapa'},
  {country:'Mexico', find:'Xalapa,ver.', replace:'Xalapa'},
  {country:'Mexico', find:'Xalapa, Ver.', replace:'Xalapa'},
  {country:'Mexico', find:'Xalapa, Ver', replace:'Xalapa'},
  {country:'Brazil', find:'San Paolo', replace:'Sao Paolo'},
  {country:'Hong Kong', find:'hk', replace:'Hong Kong'},
  {country:'Hong Kong', find:'Hk', replace:'Hong Kong'},
  {country:'Hong Kong', find:'hK', replace:'Hong Kong'},
  {country:'Hong Kong', find:'HK', replace:'Hong Kong'},
  {country:'Hong Kong', find:'hongkong', replace:'Hong Kong'},
  {country:'Hong Kong', find:'Hongkong', replace:'Hong Kong'},
  {country:'Hong Kong', find:'HongKong', replace:'Hong Kong'},
  {country:'Poland', find:'#322;upsk', replace:'Słupsk'},
  {country:'Taiwan', find:'#39640;&amp;#38596;&amp;#24066;', replace:'高雄市'},
  {country:'Italy', find:' di Castello', replace:'Città di Castello'},
  {country:'Italy', find:'#146; di csatello', replace:'Città di Castello'},
  {country:'Italy', find:' di piave', replace:'San Donà di Piave'},
  {country:'Italy', find:'#146;adda', replace:"Trezzo sull'Adda"},
  {country:'Russia', find:'#146;alessio siculo', replace:"Sant'Alessio Siculo"},
  {country:'Italy', find:"L'Aquila", replace:'#146;aquila'},
  {country:'Italy', find:"L'Aquila", replace:'#146;Aquila'},
  {country:'Italy', find:'#146;Elpidio', replace:"Porto Sant'Elpidio"},
  {country:'Poland', find:'#146;Elpidio', replace:"Bolesławiec"},
  {country:'Italy', find:'#146;Elpidio', replace:"Porto Sant'Elpidio"},
  {country:'Italy', find:'#8217;ilario d’enza (RE)', replace:"Sant'Ilario d'Enza"},
  {country:'Italy', find:'#146;Elpidio', replace:"Porto Sant'Elpidio"},
  {country:'Italy', find:'#146;Elpidio', replace:"Porto Sant'Elpidio"},
];

for(var b=0;b<fix.length;b++){
  printjson(fix[b]);
  db.users.find({"addresses.country": fix[b].country, "addresses.locality": fix[b].find},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == fix[b].country && e.addresses[a].locality == fix[b].find) e.addresses[a].locality = fix[b].replace;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"country": fix[b].country, "locality": fix[b].find}).forEach(function(e) {
    e.locality = fix[b].replace;
    var save = db.addressdbs.save(e);
    if (save.getWriteError().code == 11000) {
      printjson("REMOVEEEEE");
      db.addressdbs.remove({_id: e._id});
    }
  });
}


// TODO

for(var b=0;b<e.delete.length;b++){
  db.users.find({"addresses.country": e.delete[b].country, "addresses.locality": e.delete[b].locality}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == e.delete[b].country && e.addresses[a].locality == e.delete[b].locality);
      }
    }
    db.users.save(e);
  });
  db.addressdbs.find({"country": e.delete[b].country, "locality": e.delete[b].locality}).forEach(function(e) {
    if (e.addresses && e.length) {
      for(var a=0;a<e.length;a++){
        if (e[a].country == e.delete[b].country && e[a].locality == e.delete[b].locality);
      }
    }
    db.users.save(e);
  });
}


//db.users.find({"slug": "gianlucadelgobbo"}, {addresses: 1}).forEach(function(e) {
  db.users.find({"addresses.0": {$exists: true}}, {addresses: 1}).forEach(function(e) {
    var tmp = {};
    var tmpA = [];
    var fix = [{
      localities: ["London", "london"],
      country: 'United Kingdom',
      locality: "London"
    },{
      localities: ['Rome','Italy'],
      locality: 'Roma',
      country: 'Italy'
    }, {
      localities: ['Milan', 'Milani'],
      locality: 'Milano',
      country: 'Italy'
    }, {
      localities: ["New York", "New york", "new york", "newyork", "Newyork", "New York, Ny 10003", "New York, NY 10025", "New York,", "NEW YORK",'Newyok', 'New York City', 'New York, Ny', 'New York,', 'New York, Ny 10025', 'New York, Ny 10003'],
      locality: 'New York',
      country: 'United States'
    }, {
      localities: ["moscow", "Moscow", 'Moscow Region', 'Moscow '],
      locality: 'Moscow',
      country: 'Russia'
    }, {
      localities: ["mexico", "Mexico City", "distrito federal", "DF", "Ciudad de Mu00e9xico",'México City ', 'Mexico', 'Mexico D.f.', 'Mexico, Df', 'Cdmx', 'C.d.m,x', 'Df', 'Emxico', 'México', 'México D.f ', 'México D.f', 'Mexico Df', 'Mex', 'Mx', 'Ciudad De México', 'Cd. De México', 'Distrito Federal', 'D.f', 'D.f.', 'México City', 'México Df', 'Ciudad De Mex', 'Ciudad De Mxico', 'Mexico Distrito Federal', 'Mexico   City', 'Mecico City', 'Mexicodf', 'México D.f.', 'México, Df', 'México.'],
      locality: 'Mexico City',
      country: 'Mexico'
    }, {
      localities: ['Xalapa,ver', 'Xalapa,ver.', 'Xalapa, Ver.', 'Xalapa, Ver'],
      locality: 'Xalapa',
      country: 'Mexico'
    }, {
      localities: ['San Paolo'],
      locality: 'Sao Paolo',
      country: 'Brazil'
    }, {
      localities: ['hk','Hk','hK','HK','hongkong','Hongkong','HongKong'],
      locality: 'Hong Kong',
      country: 'Hong Kong'
    }];
    if (e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].locality) {
          e.addresses[a].locality = e.addresses[a].locality.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          for (var item in fix) {
            if (fix[item].localities.indexOf(e.addresses[a].locality)!==-1) {
              e.addresses[a].country = fix[item].country;
              e.addresses[a].locality = fix[item].locality;
            }
          }
          tmp[e.addresses[a].country+e.addresses[a].locality] = e.addresses[a];
        }
      }
      for(var item in tmp){
        tmpA.push(tmp[item]);
      }
      if (tmpA.length) {
        e.addresses = tmpA;
        db.users.update({_id: e._id}, {$set: {addresses: tmpA}}, { upsert: true });
        //printjson({addresses: tmpA});
      }
    }
  });
  
  

db.users.find({}).forEach(function(e) {
  if (e.crews && e.crews.length) e.stats.crews = e.crews.length;
  if (e.members && e.members.length) e.stats.members = e.members.length;
  if (e.performances && e.performances.length) e.stats.performances = e.performances.length;
  if (e.events && e.events.length) e.stats.events = e.events.length;
  if (e.galleries && e.galleries.length) e.stats.galleries = e.galleries.length;
  if (e.footage && e.footage.length) e.stats.footage = e.footage.length;
  if (e.playlists && e.playlists.length) e.stats.playlists = e.playlists.length;
  if (e.tvshows && e.tvshows.length) e.stats.tvshows = e.tvshows.length;
  db.users.save(e);
});



db.categories.findOne({"ancestors.0": {$exists: true}});
db.categories.find({}).forEach(function(e) {
    if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.ancestors && e.ancestors.length) {
    e.ancestor = e.ancestors[0]._id;
    delete e.ancestors;
  }
  if (e.ancestors) delete e.ancestors;
  db.categories.save(e);
});



db.users.find({"links": {$exists: true}}).forEach(function(e) {
  if (e.links && e.links.length) {
    var web = [];
    var social = [];
    for(var a=0;a<e.links.length;a++){
      if (
        e.links[a].url.indexOf("facebook.com")!==-1 ||
        e.links[a].url.indexOf("fb.com")!==-1 ||
        e.links[a].url.indexOf("twitter.com")!==-1 ||
        e.links[a].url.indexOf("instagram.com")!==-1 ||      
        e.links[a].url.indexOf("youtube.com")!==-1 ||      
        e.links[a].url.indexOf("vimeo.com")!==-1      
      ) {
        e.links[a].type = "social";
        social.push(e.links[a]);
      } else {
        web.push(e.links[a]);
      }
    }
    e.social = social;
    e.web = web;
    delete e.links;
  }
});

db.users.find({"file": {$exists: true}}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.users.save(e);
});

db.performances.find({"file": {$exists: true}}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.performances.save(e);
});

db.events.find({}).forEach(function(e) {
  if (!e.image) e.image = e.file;
  if (e.file) delete e.file;
  db.events.save(e);
});

db.events.find({"schedule.venue.location.city":{$exists: true}}).forEach(function(e) {
  if (e.schedule && e.schedule.length) {
    for(var a=0;a<e.schedule.length;a++){
      e.schedule[a].venue.location.locality = e.schedule[a].venue.location.city;
      delete e.schedule[a].venue.location.city;
    }
  }
  db.events.save(e);
});



db.users.find({"addresses.country": "Russian Federation"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].country === "Russian Federation") e.addresses[a].country = "Russia";
    }
  }
  db.users.save(e);
});

db.footage.deleteMany({"file.file": { $exists: false}});
db.footage.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.playlists && e.playlists.length) {
    var tmpA = [];
    for(var a=0;a<e.playlists.length;a++){
      tmpA.push(e.playlists[a]._id);
    }
    e.playlists = tmpA;
  }
  e.media = e.file;
  delete e.file;
  db.footage.save(e);
});

db.tvshows.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }
  e.media = e.file;
  delete e.file;
  db.tvshows.save(e);
});

db.playlists.update({"users.0":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.playlists.find({"users.0":{$exists:false}}, {"users": 1});

db.playlists.find({"footage.0": {$exists: false}});
db.playlists.remove({"footage.0": {$exists: false}});

//db.playlists.find({permalink: {$exists: false}}).forEach(function(e) {
db.playlists.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.footage && e.footage.length) {
    var tmpA = [];
    for(var a=0;a<e.footage.length;a++){
      tmpA.push(e.footage[a]._id);
    }
    e.footage = tmpA;
    e.stats.footage = e.footage.length;
  }
  e.image = e.file;
  delete e.file;
  db.playlists.save(e);
});

//db.galleries.find({"performances.0":{$exists: true}}).forEach(function(e) {
db.galleries.find({}).forEach(function(e) {
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }
  if (e.performances && e.performances.length) {
    var tmpA = [];
    for(var a=0;a<e.performances.length;a++){
      tmpA.push(e.performances[a]._id);
    }
    //e.performances = tmpA;
  }
  if (e.events && e.events.length) {
    var tmpA = [];
    for(var a=0;a<e.events.length;a++){
      tmpA.push(e.events[a]._id);
    }
    e.events = tmpA;
  }
  if (e.medias && e.medias.length) {
    var tmpA = [];
    for(var a=0;a<e.medias.length;a++){
	    var tmpO = {
		  file: e.medias[a].file,
		  filename: e.medias[a].file.substring(e.medias[a].file.lastIndexOf('/') + 1),
		  originalname: e.medias[a].file.substring(e.medias[a].file.lastIndexOf('/') + 1),
		  size: e.medias[a].file.filesize,
		
		  encoded: e.medias[a].file.encoded,
		  users: [e.medias[a].users[0]._id],
		  stats: e.medias[a].stats,
		  title: e.medias[a].title,
		  slug: e.medias[a].permalink
		}
		tmpA.push(tmpO);
    }
    e.medias = tmpA;
  }
  e.image = e.file;
  delete e.file;
  db.galleries.save(e);
});




db.tvshows.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.galleries.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.footage.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.performances.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.events.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);

db.performances.find({"files.file":{'$regex': '90x68/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('90x68/','');
  db.performances.save(e);
});
db.gallery.find({"files.file":{'$regex': '128x96/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('128x96/','');
  db.gallery.save(e);
});




//db.runCommand ( { distinct: 'users',key: 'locations'} )
//db.categories.find({"ancestors" :{$exists:false},"ancestor_old_id":{$ne:"0"}});

//{permalink:'lpm-2017-amsterdam'}
db.events.find({}).forEach(function(e) {
  e.is_public = e.is_public===1;
  e.gallery_is_public = e.gallery_is_public===1;
  e.is_freezed = e.is_freezed===1;

  if (e.partners && e.partners.length) {
    var partners_new = [];
    var trovato;
    for(var a=0;a<e.partners.length;a++){
      for(var b=0;b<e.partners[a].categories.length;b++){
        trovato = false;
        for(var c=0;c<partners_new.length;c++){
          if (partners_new[c].category.toString() == e.partners[a].categories[b]._id.toString()) {
            partners_new[c].users.push(e.partners[a].user._id);
            trovato = true;
          }
        }
        if (!trovato) {
          partners_new.push({category: e.partners[a].categories[b]._id, users:[e.partners[a].user._id]});
        }
      }
    }
    e.partners = partners_new;
  }

  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.subtitle) {
    e.subtitles = [];
    if (e.subtitle) {
      for (var item in e.subtitle) {
        var tmp = {};
        tmp.lang = item;
        tmp.abouttext = e.subtitle[item];
        e.subtitles.push(tmp);
      }
    }
    delete e.subtitle;
  }
  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }

  if (e.tobescheduled && e.tobescheduled.length) {
    var tmpA = [];
    for(var a=0;a<e.tobescheduled.length;a++){
      tmpA.push(e.tobescheduled[a].uid);
    }
    e.tobescheduled = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.galleries && e.galleries.length) {
    var tmpA = [];
    for(var a=0;a<e.galleries.length;a++){
      tmpA.push(e.galleries[a]._id);
    }
    e.galleries = tmpA;
  }

  if (e.settings.permissions.administrator && e.settings.permissions.administrator.length) {
    var tmpA = [];
    for(var a=0;a<e.settings.permissions.administrator.length;a++){
      tmpA.push(e.settings.permissions.administrator[a]._id);
    }
    e.settings.permissions.administrator = tmpA;
  }

  if (e.program && e.program.length) {
    for(var a=0;a<e.program.length;a++){
      var tmpA = [];
      for(var b=0;b<e.program[a].schedule.categories.length;b++){
        tmpA.push(e.program[a].schedule.categories[b]._id);
      }
      e.program[a].performance = e.program[a].performance._id;
      e.program[a].schedule.categories = tmpA;
    }
  }

  db.events.save(e);
});

//{permalink:'vector-vs-bitmap'}
db.performances.find({}).forEach(function(e) {
  e.is_public = e.is_public===1;
  delete e.img_data_id;
  delete e.img_data_type;
  delete e.img_data_folder;
  delete e.img_data_name;
  delete e.img_data_est;
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  if (e.permalink) delete e.permalink;

  if (e.users && e.users.length) {
    var tmpA = [];
    for(var a=0;a<e.users.length;a++){
      tmpA.push(e.users[a]._id);
    }
    e.users = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.gallery && e.gallery.length) {
    var tmpA = [];
    for(var a=0;a<e.gallery.length;a++){
      tmpA.push(e.gallery[a]._id);
    }
    e.galleries = tmpA;
    delete e.gallery;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.tech_req) {
    var tech_req = e.tech_req["en"];
    if (!tech_req) {
      for (var item in e.tech_req) {
        if (!tech_req) tech_req = e.tech_req[item];
      }
    }
    e.tech_req = tech_req;
  } else {
    e.tech_req = "";
  }
  delete e.tech_art;
  e.tech_art = "";

  if (e.locations && e.locations.length) {
    e.addresses = [];
    for(var a=0;a<e.locations.length;a++){
      var tmp = {};
      if(e.locations[a].country) tmp.country = e.locations[a].country;
      if(e.locations[a].city) tmp.locality = e.locations[a].city;
      if(e.locations[a].zip) tmp.postal_code = e.locations[a].zip;
      if(e.locations[a].street) tmp.route = e.locations[a].street;
      e.addresses[a] = tmp;
      e.addresses.push(tmp);
    }
    delete e.locations;
  }

  if (e.emails && e.emails.length) {
    for(var a=0;a<e.emails.length;a++){
      e.emails[a].is_public = e.emails[a].public==="1";
      delete e.emails[a].public;
      e.emails[a].is_confirmed = e.emails[a].valid==="1";
      delete e.emails[a].valid;
      e.emails[a].is_primary = e.emails[a].primary==="1";
      e.emails[a].mailinglists.flxer = e.emails[a].mailinglists.flxer===1;
      e.emails[a].mailinglists.flyer = e.emails[a].mailinglists.flyer===1;
      e.emails[a].mailinglists.livevisuals = e.emails[a].mailinglists.livevisuals===1;
      e.emails[a].mailinglists.updates = e.emails[a].mailinglists.updates===1;
      delete e.emails[a].primary;
      if (e.emails[a].is_primary) {
        e.email = e.emails[a].email;
      }
    }
  }

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (e.bookings && e.bookings.length) {
    for(var a=0;a<e.bookings.length;a++){
      var tmpA = [];
      for(var b=0;b<e.bookings[a].schedule.categories.length;b++){
        tmpA.push(e.bookings[a].schedule.categories[b]._id);
      }
      e.bookings[a].event = e.bookings[a].event._id;
      e.bookings[a].schedule.categories = tmpA;
    }
  }

  db.performances.save(e);
});

//{surname:"Del Gobbo"}
//{surname:"Del Gobbo"}
db.users.find({}).forEach(function(e) {
  e.is_crew = e.is_crew===1;
  e.is_public = e.is_public===1;
  delete e.public;
  e.image = e.file;
  delete e.file;
  delete e.updated;
  delete e.img_data_id;
  delete e.img_data_type;
  delete e.img_data_folder;
  delete e.img_data_name;
  delete e.img_data_est;
  delete e.login;
  e.stagename = e.display_name;
  delete e.display_name;
  e.birthday = e.birth_date;
  delete e.birth_date;
  if (!e.slug) e.slug = e.permalink.toLowerCase();
  e.username = e.slug;
  if (e.permalink) delete e.permalink;
  if (e.locations && e.locations.length) {
    e.addresses = [];
    for(var a=0;a<e.locations.length;a++){
      var tmp = {};
      if(e.locations[a].country) tmp.country = e.locations[a].country;
      if(e.locations[a].city) tmp.locality = e.locations[a].city;
      if(e.locations[a].zip) tmp.postal_code = e.locations[a].zip;
      if(e.locations[a].street) tmp.route = e.locations[a].street;
      e.addresses[a] = tmp;
      e.addresses.push(tmp);
    }
    delete e.locations;
  }

  if (e.text) {
    e.abouts = [];
    for (var item in e.text) {
      var tmp = {};
      tmp.lang = item;
      tmp.abouttext = e.text[item];
      e.abouts.push(tmp);
    }
    delete e.text;
  }

  if (e.emails && e.emails.length) {
    for(var a=0;a<e.emails.length;a++){
      e.emails[a].is_public = e.emails[a].public==="1";
      delete e.emails[a].public;
      e.emails[a].is_confirmed = e.emails[a].valid==="1";
      delete e.emails[a].valid;
      e.emails[a].is_primary = e.emails[a].primary==="1";
      e.emails[a].mailinglists.flxer = e.emails[a].mailinglists.flxer===1;
      e.emails[a].mailinglists.flyer = e.emails[a].mailinglists.flyer===1;
      e.emails[a].mailinglists.livevisuals = e.emails[a].mailinglists.livevisuals===1;
      e.emails[a].mailinglists.updates = e.emails[a].mailinglists.updates===1;
      delete e.emails[a].primary;
      if (e.emails[a].is_primary) {
        e.email = e.emails[a].email;
      }
    }
  }

  if (e.websites && e.websites.length) {
    e.links = [];
    for(var a=0;a<e.websites.length;a++){
      if (e.websites[a] && e.websites[a].url) {
        var tmp = {};
        tmp.type = "web";
        tmp.url = e.websites[a].url;
        e.links.push(tmp);
      }
    }
    delete e.websites;
  }

  if (!e.is_crew && e.crews && e.crews.length) {
    var tmpA = [];
    for(var a=0;a<e.crews.length;a++){
      tmpA.push(e.crews[a]._id);
    }
    e.crews = tmpA;
  }

  if (e.categories && e.categories.length) {
    var tmpA = [];
    for(var a=0;a<e.categories.length;a++){
      tmpA.push(e.categories[a]._id);
    }
    e.categories = tmpA;
  }

  if (e.performances && e.performances.length) {
    var tmpA = [];
    for(var a=0;a<e.performances.length;a++){
      tmpA.push(e.performances[a]._id);
    }
    e.performances = tmpA;
  }

  if (e.events && e.events.length) {
    var tmpA = [];
    for(var a=0;a<e.events.length;a++){
      tmpA.push(e.events[a]._id);
    }
    e.events = tmpA;
  }

  if (e.tvshow && e.tvshow.length) {
    var tmpA = [];
    for(var a=0;a<e.tvshow.length;a++){
      tmpA.push(e.tvshow[a]._id);
    }
    e.tvshows = tmpA;
    delete e.tvshow;
  }

  if (e.footage && e.footage.length) {
    var tmpA = [];
    for(var a=0;a<e.footage.length;a++){
      tmpA.push(e.footage[a]._id);
    }
    e.footage = tmpA;
  }

  if (e.is_crew && e.members && e.members.length) {
    var tmpA = [];
    for(var a=0;a<e.members.length;a++){
      tmpA.push(e.members[a]._id);
    }
    e.members = tmpA;
  }

  if (e.playlists && e.playlists.length) {
    var tmpA = [];
    for(var a=0;a<e.playlists.length;a++){
      tmpA.push(e.playlists[a]._id);
    }
    e.playlists = tmpA;
  }

  if (e.galleries && e.galleries.length) {
    var tmpA = [];
    for(var a=0;a<e.galleries.length;a++){
      tmpA.push(e.galleries[a]._id);
    }
    e.galleries = tmpA;
  }

  delete e.stats;
  e.stats = {};
  if (e.events && e.events.length) e.stats.events = new NumberInt(e.events.length);
  if (e.performances && e.performances.length) e.stats.performances = new NumberInt(e.performances.length);
  if (e.tvshows && e.tvshows.length) e.stats.tvshows = new NumberInt(e.tvshows.length);
  if (e.playlists && e.playlists.length) e.stats.playlists = new NumberInt(e.playlists.length);
  if (e.footage && e.footage.length) e.stats.footage = new NumberInt(e.footage.length);
  if (e.galleries && e.galleries.length) e.stats.galleries = new NumberInt(e.galleries.length);
  if (e.members && e.members.length) e.stats.members = new NumberInt(e.members.length);
  if (e.crews && e.crews.length) {
    e.stats.crews = new NumberInt(e.crews.length);
  } else if (e.crews && e.crews.length==0) {
    delete e.crews;
  }
  e.activity = 0;
  e.activity+= (e.stats.events ? e.stats.events             * 5 : 0);
  e.activity+= (e.stats.performances ? e.stats.performances * 3 : 0);
  e.activity+= (e.stats.tvshows ? e.stats.tvshows           * 3 : 0);
  e.activity+= (e.stats.footage ? e.stats.footage           * 1 : 0);
  e.activity+= (e.stats.playlists ? e.stats.playlists       * 2 : 0);
  e.activity+= (e.stats.galleries ? e.stats.galleries       * 1 : 0);

  db.users.save(e);
});
db.events.find({slug:'live-cinema-festival-2017'}).forEach(function(e) {
  e.organizationsettings = {
    program_builder: true,
    advanced_proposals_manager: true,
    call_is_active: true,
	  call: {
	    nextEdition: "String nextEdition", 
	    subImg: "teaserImage subImg", 
	    subBkg: "backgroundImage subBkg", 
	    colBkg: "String colBkg", 
	    calls: [{
        title: "LPM 2018 Rome", 
        email: "subscriptions@liveperformersmeeting.net", 
        slug: "lpm2018rome", 
        start_date: new Date('2018-01-01 00:00:00'), 
        end_date: new Date('2018-01-31 23:59:59'), 
        admitted: [
          ObjectId("59fc65d6ff4bcb5a6100018c"), 
          ObjectId("59fc65d6ff4bcb5a6100021d"), 
          ObjectId("59fc65d6ff4bcb5a6100021e")
        ], 
        excerpt: '<p>Are you an artist working in the field of live audiovisual performance? Do you wish to take part in the programme of LPM with presentation of your project?<br>Here is what we are looking for:</p><ul><li><strong>AV performances </strong>LPM is interested to any kind of projects that use very different techniques, but at the same time follow a common thread that evolves throughout the day. From video theater to video dance, from live cinema performances to queer culture, from generative music and visuals to live coding.LPM offer to every show 30 minutes.</li><li><strong>VJ Sets<br></strong>LPM is looking for video wizards wishing to flock to our screens with colors, stories, and visual rhythms in front of more than 10.000 people during the night party. LPM offer to every show 30 minutes.</li><li><strong>Mapping performances</strong>LPM is interested to any kind of live mapping show that are able to enhance the skill of the performer by revisiting the urban architecture of RADION.LPM offer to every show 30 minutes.<strong><br><a href="https://flyer.dev.flyer.it/files/2017/04/LiveMappingContest-LPM2017_KIT.zip" download="LiveMappingContest-LPM2017_KIT.zip">MAPPING KIT DOWNLOAD</a></strong></li><li><strong>Interactive installations</strong>LPM is interested to installation that use sound, video, touch and movement merged in a common language dedicated to the creation of interactive games and perceptual experiences of meaning and image.<br>Installations are visible during all the duration of the event.LPM can not guarantee the full technical support. No technical support request is welcome.</li><li><strong>Project showcase<br></strong>If you have a project that in some way involve live video LPM offer 30 minutes on the stage during the Day programme.<br>The project could be a software or hardware, a product or a free stuff, a web site or an app, realized or just an idea.</li><li><strong>Lecture<br></strong>LPM is interested to offer to participants successful case stories that can be open the minds to the various aspect of live video culture.</li><li><strong>Workshop<br></strong>Once you submit your proposal, LPM will check the feasibility, once accepted you will be able to end your subscription.</li></ul>', 
        terms: '<p><strong>LPM is a meeting.<br> </strong><br> LPM offers sites, resources and technologies to support the encounters among people active in the field of live video. Our goal is to provide both spectators and participants with a wide program of workshops, exhibitions and live audio and video performances. <br> <br> The fact that all the artists play live and the ability to freely participate in the meeting are among the most important aspects of LPM.</p><ol><li>The subscription fee includes access to all activities of the event (except workshop fee), plus the LPM t-shirt, 1 drink per day, slot for your proposal and special prices for software, hardware and workshops.</li><li>The deadline for subscription is <strong>###DEADLINE###</strong>.</li><li>LPM is a meeting, we encourage all who wish to contribute to participate in the event. However, due to the large number of proposals we receive, we are not able to cover the travel expenses of each artist. So we would like to remember that <span style="text-decoration: underline;">travel expenses are the responsibility of artists</span>.</li><li><strong>Accommodation for performing artists is available from 1 to 5 nights from 17 to 22 of May, subject to availability, in triple / quadruple / dormitories.</strong></li><li>Solutions available in single and double rooms.</li><li>Artists, friends and partners can also book accommodation at an affordable price at the <a href="../participate/?lpm_sub_type=visitors">Special Package</a> webpage.</li><li>Due to logistical and time constraints, it may happen that some of the audiovisual performances will not be included in the official programme: priority will be given to those projects that are considered of special interest to most of our participants.</li><li><strong>The maximum duration of each act is 30 minutes</strong>.</li><li>At the discretion of the organizers, activities that include too complicated technical and logistical requirements can be excluded. Do not hesitate to contact us directly via subscriptions [at] liveperformersmeeting [dot] net to discuss your proposal beforehand.</li></ol>', 
        packages: [
          {
            name: "Basic subscription", 
            price: 10, 
            description: "1 pass valid for all activities<br />1 drink per day<br />1 T-Shirt<br />1 Slot for your proposal", 
            personal: true, 
            requested: true, 
            allow_multiple: true, 
            allow_options: true, 
            options_name: "T-Shirt Size", 
            options: "S-Man,L-Man,XL-Man", 
            daily: false, 
            start_date: new Date('2018-01-01 00:00:00'),
            end_date: new Date('2018-01-31 23:59:59')
          },{
            name: "Accommodation", 
            price: 30, 
            description: "1 bed in dorms", 
            personal: true, 
            requested: false, 
            allow_multiple: false, 
            allow_options: false, 
            options_name: "", 
            options: "", 
            daily: true, 
            start_date: new Date('2018-01-01 00:00:00'),
            end_date: new Date('2018-01-31 23:59:59')
          }
        ], 
        topics: [
          {
              name: "String topics name", 
              description: "String topics description"
          }
        ]
      }]
    }
  }
  db.events.save(e);
});
/* OLD FIX COUNTRY

db.users.find({"addresses.locality": "New York"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "New York") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});

db.users.find({"addresses.locality": "New york"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "New york") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "new york"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "new york") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "newyork"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "newyork") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "Newyork"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "Newyork") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "New York, Ny 10003"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "New York, Ny 10003") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "New York, NY 10025"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "New York, NY 10025") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "New York,"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "New York,") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});

db.users.find({"addresses.locality": "NEW YORK"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "NEW YORK") e.addresses[a].country = 'United States';
    }
  }
  db.users.save(e);
});

db.users.find({"addresses.locality": "London"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "London") e.addresses[a].country = 'United Kingdom';
    }
  }
  db.users.save(e);
});

db.users.find({"addresses.locality": "london"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "london") e.addresses[a].country = 'United Kingdom';
    }
  }
  db.users.save(e);
});

db.users.find({"addresses.locality": "moscow"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "moscow") e.addresses[a].country = 'Russian Federation';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "Moscow"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "Moscow") e.addresses[a].country = 'Russian Federation';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "mexico"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "mexico") e.addresses[a].country = 'Mexico';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "Mexico City"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "Mexico City") e.addresses[a].country = 'Mexico';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "distrito federal"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "distrito federal") e.addresses[a].country = 'Mexico';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "DF"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "DF") e.addresses[a].country = 'Mexico';
    }
  }
  db.users.save(e);
});
db.users.find({"addresses.locality": "Ciudad de Mu00e9xico"}).forEach(function(e) {
  if (e.addresses && e.addresses.length) {
    for(var a=0;a<e.addresses.length;a++){
      if (e.addresses[a].locality === "Ciudad de Mu00e9xico") e.addresses[a].country = 'Mexico';
    }
  }
  db.users.save(e);
});
*/