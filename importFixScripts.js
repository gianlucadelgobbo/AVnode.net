//export LC_ALL="en_US.UTF-8"
//mongorestore --drop -d avnode_bruce /data/dumps/avnode_bruce_fixed/avnode_bruce
//mongodump -d avnode_bruce --out /data/dumps/avnode_bruce_fixed
//rsync -a /space/PhpMysql2015/sites/flxer/warehouse/ /sites/avnode/warehouse
//find '/sites/flxer/warehouse' -name "original_video"  | xargs du -sh
//rsync -a /space_fisica/PhpMysql2015/sites/flxer/warehouse_new/ /space_fisica/MongoNodeJS/sites/avnode.net/warehouse_new
//find '/sites/avnode.net/warehouse/users_originals/' -name "100x100"  | xargs du -sh

//find '/sites/avnode.net/warehouse/performances_originals/' -name "1040x585" -type d -exec rm -R "{}" \;
//find '/sites/avnode.net/warehouse/performances' -maxdepth 5 -type f -exec rm "{}" \;

// Deletecity

var fix = [
  {country: 'Italy', locality: 'C'},
  {country: 'Romania', locality: 'C'},
  {country: 'Italy', locality: 'Ca'},
  {country: 'Afghanistan', locality: 'Ca'},
  {country: 'United States', locality: 'Ca'},
  {country: 'Argentina', locality: 'Caba'},
  {country: 'Poland', locality: '#324;'},
  {country: 'Hungary', locality: '#337;r'},
  {country: 'Taiwan', locality: '#39640;&#38596;&#24066;'},
  {country: 'Australia', locality: '&Gt;&gt;'},
  {country: 'Italy', locality: '*'},
  {country: 'Spain', locality: '+34'},
  {country: 'Austria', locality: '-'},
  {country: 'Germany', locality: '-'},
  {country: 'Finland', locality: '-'},
  {country: 'United Kingdom', locality: '-'},
  {country: 'Italy', locality: '- -'},
  {country: 'Italy', locality: '--'},
  {country: 'Italy', locality: '---'},
  {country: 'Italy', locality: '-1'},
  {country: 'United States', locality: '.'},
  {country: 'Argentina', locality: '.'},
  {country: 'United Kingdom', locality: '.'},
  {country: 'Australia', locality: '.'},
  {country: 'Portugal', locality: '.'},
  {country: 'Italy', locality: '.'},
  {country: 'United Kingdom', locality: '..'},
  {country: 'Italy', locality: '..'},
  {country: 'Dominican Republic', locality: '..'},
  {country: 'Mexico', locality: '...'},
  {country: 'France', locality: '/'},
  {country: 'Poland', locality: '071'},
  {country: 'Vietnam', locality: '1'},
  {country: 'Bahrain', locality: '11'},
  {country: 'Barbados', locality: '11'},
  {country: 'Italy', locality: '12'},
  {country: 'Belgium', locality: '1366'},
  {country: 'Italy', locality: '15'},
  {country: 'India', locality: '201301'},
  {country: 'Italy', locality: '2210'},
  {country: 'Burma', locality: '23'},
  {country: 'Germany', locality: '2312131'},
  {country: 'Rwanda', locality: '28'},
  {country: 'Italy', locality: '29'},
  {country: 'Mexico', locality: '400'},
  {country: 'Afghanistan', locality: '45455'},
  {country: 'Italy', locality: '46'},
  {country: 'Austria', locality: '5722'},
  {country: 'Austria', locality: 'Aalfang'},
  {country: 'Austria', locality: 'Abc'},
  {country: 'Australia', locality: 'Abbblkfio'},
  {country: 'Australia', locality: 'Abcder'},
  {country: 'France', locality: '60 Deglingos'},
  {country: 'Benin', locality: '80500'},
  {country: 'Bahrain', locality: 'Adasd'},
  {country: 'Angola', locality: 'Adsdas'},
  {country: 'Belarus', locality: 'Aezeaz'},
  {country: 'Bahamas', locality: 'Affwfawf'},
  {country: 'Angola', locality: 'Ahoritas'},
  {country: 'South Africa', locality: 'Ak An Be'},
  {country: 'Canada', locality: 'Alava'},
  {country: 'Albania', locality: 'Albania'},
  {country: 'Spain', locality: 'Algme'},
  {country: 'Italy', locality: 'Allucinopoli'},
  {country: 'Algeria', locality: 'Almanjana'},
  {country: 'Brazil', locality: 'America'},
  {country: 'British Virgin Islands', locality: 'Americana'},
  {country: 'Brazil', locality: 'Americana'},
  {country: 'Bahrain', locality: 'Amman'},
  {country: 'Aruba', locality: 'Amman'},
  {country: 'Argentina', locality: 'Amsterdam'},
  {country: 'Latvia', locality: 'Amsterdam'},
  {country: 'Andorra', locality: 'Andorra'},
  {country: 'Netherlands', locality: 'Angola'},
  {country: 'Turkey', locality: 'Angora'},
  {country: 'United Kingdom', locality: 'Anno'},
  {country: 'Switzerland', locality: 'Ansted'},
  {country: 'Cambodia', locality: 'Any'},
  {country: 'Poland', locality: 'Anywhere'},
  {country: 'Russia', locality: 'Are'},
  {country: 'Portugal', locality: 'Arendal'},
  {country: 'Angola', locality: 'Arkangello'},
  {country: 'Albania', locality: 'Arno'},
  {country: 'United States', locality: 'Around'},
  {country: 'Aruba', locality: 'Aruba'},
  {country: 'Australia', locality: 'As'},
  {country: 'Angola', locality: 'Asd'},
  {country: 'Albania', locality: 'Asscity'},
  {country: 'Algeria', locality: 'Audiofreak'},
  {country: 'Australia', locality: 'Australia'},
  {country: 'Austria', locality: 'Austria'},
  {country: 'Argentina', locality: 'Avell'},
  {country: 'Egypt', locality: 'Avila'},
  {country: 'Belarus', locality: 'Awdad'},
  {country: 'Afghanistan', locality: 'Babelwed'},
  {country: 'Afghanistan', locality: 'Bahillha'},
  {country: 'Anguilla', locality: 'Barain'},
  {country: 'Barbados', locality: 'Barbados'},
  {country: 'Angola', locality: 'Asd'},
  {country: 'Botswana', locality: 'Asd'},
  {country: 'Afghanistan', locality: 'Asd'},
  {country: 'Argentina', locality: 'Asdas'},
  {country: 'Turkey', locality: 'Asdas'},
  {country: 'Antigua and Barbuda', locality: 'Asdasd'},
  {country: 'Belarus', locality: 'Asdasd'},
  {country: 'Angola', locality: 'Asdasd'},
  {country: 'American Samoa', locality: 'Asdasdasd'},
  {country: 'Armenia', locality: 'Asdds'},
  {country: 'Algeria', locality: 'Asdeeqq'},
  {country: 'Japan', locality: 'Asdf'},
  {country: 'American Samoa', locality: 'Asdf'},
  {country: 'Albania', locality: 'Asdf'},
  {country: 'Afghanistan', locality: 'Asdfasdf'},
  {country: 'American Samoa', locality: 'Asdfsdc'},
  {country: 'Argentina', locality: 'Asfasf'},
  {country: 'Benin', locality: 'Assa'},
  {country: 'Hong Kong', locality: 'B'},
  {country: 'Italy', locality: 'B'},
  {country: 'Spain', locality: 'B'},
  {country: 'Italy', locality: 'B.a.'},
  {country: 'Italy', locality: 'Ba'},
  {country: 'Slovakia', locality: 'Ba'},
  {country: 'Argentina', locality: 'Ba'},
  {country: 'Argentina', locality: 'Ba As'},
  {country: 'Italy', locality: '95013'},
  {country: 'Netherlands', locality: '9781'},
  {country: 'Italy', locality: '?'},
  {country: 'France', locality: '???'},
  {country: 'United States', locality: 'A'},
  {country: 'France', locality: ''},
  {country: 'Norway', locality: ''},
  {country: 'Japan', locality: 'A'},
  {country: 'Italy', locality: ''},
  {country: 'Greece', locality: 'A'},
  {country: 'France', locality: 'A'},
  {country: 'Australia', locality: 'A'},
  {country: 'Italy', locality: 'A Spasso Per La Sicilia'},
  {country: 'India', locality: "A'bad"},
  {country: 'China', locality: 'Aa'},
  {country: 'China', locality: 'A'},
  {country: 'Aruba', locality: 'Aa'},
  {country: 'Afghanistan', locality: 'Aa'},
  {country: 'United States', locality: 'Aaa'},
  {country: 'Italy', locality: 'Aaa'},
  {country: 'Aruba', locality: 'Aaa'},
  {country: 'Afghanistan', locality: 'Aaaa'},
  {country: 'Algeria', locality: 'Aaaa'},
  {country: 'Afghanistan', locality: 'Aaaaaaaa'}
];
for(var b=0;b<fix.length;b++){
  db.users.find({"addresses.country": fix[b].country, "addresses.locality": fix[b].locality},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == fix[b].country && e.addresses[a].locality == fix[b].locality) delete e.addresses[a].locality;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"country": fix[b].country, "locality": fix[b].locality}).forEach(function(e) {
    delete e.locality;
    var save = db.addressdbs.save(e);
    if (save.getWriteError() && save.getWriteError().code == 11000) {
      printjson("REMOVEEEEE");
      db.addressdbs.remove({_id: e._id});
    }  
  });
}

s
/*
{find: 'Canada', findlocality: 'Alava', replace: 'Comox-Strathcona'},
{find: 'Switzerland', findlocality: 'Ansted', replace: 'United States'},
{find: 'Benin', findlocality: 'Assa', replace: 'Nigeria'},
{find: 'Cambodia', findlocality: 'Any', replace: 'United States'},
{find: 'Russia', findlocality: 'Are', replace: 'Estonia'},
{find: 'Angola', findlocality: 'Asd', replace: 'Italy'},
{find: 'China', findlocality: 'Bath', replace: 'United States'},
{find: 'Czech Republic', findlocality: 'Bechyně', replace: 'Czech Republic'},
{find: 'Bulgaria', findlocality: 'Campo Grande', replace: 'Argentina'},
  {find: 'Afghanistan', findlocality: 'Canada', replace: 'Canada'},
  {find: 'China', findlocality: 'Candan', replace: 'United States'},
  {find: 'China', findlocality: 'Candy', replace: 'United States'},
  {find: 'Afghanistan', findlocality: 'Ca', replace: 'United States'},
  {find: 'China', findlocality: 'Big', replace: 'United States'},
  {find: 'Chile', findlocality: 'Bking', replace: 'United States'},
  {find: 'Germany', findlocality: 'Bl', replace: 'Switzerland'},
  {find: 'Georgia', findlocality: 'Blackshear', replace: 'United States'},
  {find: 'Albania', findlocality: 'Bo', replace: 'United States'},
  {find: 'Brazil', findlocality: 'Brazil', replace: 'United States'},
  {find: 'Aruba', findlocality: 'Dave', replace: 'Canada'},
  {find: 'Bahamas', findlocality: 'Deee', replace: 'The Bahamas'},
  {find: 'Aruba', findlocality: 'Deee', replace: 'United States'},
  {find: 'Spain', findlocality: 'Columbia', replace: 'United States'},
  {find: 'Angola', findlocality: 'Cps', replace: 'United States'},
  {find: 'Albania', findlocality: 'Creag', replace: 'United States'},
  {find: 'Azerbaijan Republic', findlocality: 'China', replace: 'China'},
  {find: 'Georgia', findlocality: 'China', replace: 'United States'},
  {find: 'China', findlocality: 'China', replace: 'United States'},
  {find: 'Armenia', findlocality: 'China', replace: 'United States'},
  {find: 'Albania', findlocality: 'City', replace: 'United States'},
  {find: 'Belgium', findlocality: 'City', replace: 'United States'},
  {find: 'Ukraine', findlocality: 'Opole', replace: 'Poland'},
  {find: 'China', findlocality: 'Ny', replace: 'United States'},
  {find: 'Algeria', findlocality: 'Ny', replace: 'United States'},
  {find: 'Austria', findlocality: 'Ny', replace: 'United States'},
  {find: 'China', findlocality: 'Nb', replace: 'Canada'},
  {find: 'Andorra', findlocality: 'Ncr', replace: 'Philippines'},
  {find: 'France', findlocality: 'New Market', replace: 'United States'},
  {find: 'Virgin Islands (U.S.)', findlocality: 'No', replace: 'U.S. Virgin Islands'},
  {find: 'Afghanistan', findlocality: 'None', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Mut', replace: 'United States'},
  {find: 'Ireland', findlocality: 'Londonderry', replace: 'United Kingdom'},
  {find: 'Germany', findlocality: 'Ln', replace: 'United States'},
  {find: 'Bahamas', findlocality: 'Lomo', replace: 'Spain'},
  {find: 'Belize', findlocality: 'Leon', replace: 'United States'},
  {find: 'Hong Kong', findlocality: 'Kennett Square', replace: 'United States'},
  {find: 'British Virgin Islands', findlocality: 'Kent', replace: 'India'},
  {find: 'Afghanistan', findlocality: 'Kingston', replace: 'Canada'},
  {find: 'Western Sahara', findlocality: 'Kolkata', replace: 'India'},
  {find: 'Afghanistan', findlocality: 'Italy', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Internet', replace: 'Mexico'},
  {find: 'China', findlocality: 'Hz', replace: 'United States'},
  {find: 'China', findlocality: 'Fs', replace: 'Hong Kong'},
  {find: 'Afghanistan', findlocality: 'Fuckerton', replace: 'United States'},
  {find: 'Afghanistan', findlocality: 'Gotham', replace: 'United States'},
  {find: 'Germany', findlocality: 'Graz', replace: 'Austria'},
  {find: 'China', findlocality: 'Jm', replace: 'United States'},
  {find: 'Barbados', findlocality: 'Roma', replace: 'Mexico'},
  {find: 'Angola', findlocality: 'Re', replace: 'United States'},
  {find: 'Brazil', findlocality: 'Porto', replace: 'United States'},
  {find: 'Afghanistan', findlocality: 'Pi', replace: 'India'},
  {find: 'Burkina Faso', findlocality: 'Poitiers', replace: 'France'},
  {find: 'China', findlocality: 'Xx', replace: 'Mexico'},
  {find: 'Colombia', findlocality: 'Wf', replace: 'United States'},
  {find: 'Angola', findlocality: 'Werdsd', replace: 'United States'},
  {find: 'Andorra', findlocality: 'Vegus', replace: 'United States'},
  {find: 'Bangladesh', findlocality: 'Verdun', replace: 'Canada'},
  {find: 'Aruba', findlocality: 'Usa', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Ttttt', replace: 'Mexico'},
  {find: 'France', findlocality: 'Tiffin', replace: 'United States'},
  {find: 'China', findlocality: 'Tj', replace: 'United States'},
  {find: 'India', findlocality: 'Tempe', replace: 'United States'},
  {find: 'Bahamas', findlocality: 'Texas', replace: 'United States'},
  {find: 'Bangladesh', findlocality: 'Svg', replace: 'India'},
  {find: 'Azerbaijan Republic', findlocality: 'Str', replace: 'Azerbaijan'},
  {find: 'RU', findlocality: 'Sobra', replace: 'Croatia'},
  {find: 'China', findlocality: 'Sf', replace: 'United States'},
  {find: 'Armenia', findlocality: 'Slowakia', replace: 'Austria'},
  {find: 'American Samoa', findlocality: 'Space', replace: 'United States'},
  */
// countryfix
var fix = [
  {find: 'Jordan', findlocality: 'Abu Dhabi', replace: 'United Arab Emirates'},
  {find: 'India', findlocality: 'Abu Dhabi', replace: 'United Arab Emirates'},
  {find: 'Afghanistan', findlocality: 'Aachen', replace: 'Germany'},
  {find: 'Cote D Ivoire (Ivory Coast)', findlocality: 'Abidjan', replace: "Côte d'Ivoire"},
  {find: 'India', findlocality: 'Abu Dhabi', replace: 'United Arab Emirates'},
  {find: 'Macau', findlocality: 'Aguascalientes', replace: 'Mexico'},
  {find: 'Barbados', findlocality: 'Alabama', replace: 'United States'},
  {find: 'Angola', findlocality: 'Amsterdam', replace: 'Netherlands'},
  {find: 'Greece', findlocality: 'Amsterdam', replace: 'Netherlands'},
  {find: 'Australia', findlocality: 'Amsterdam', replace: 'Netherlands'},
  {find: 'Albania', findlocality: 'Amsterdam', replace: 'Netherlands'},
  {find: 'Germany', findlocality: 'Amsterdam', replace: 'Netherlands'},
  {find: 'Angola', findlocality: 'Angola', replace: 'Netherlands'},
  {find: 'Bangladesh', findlocality: 'Angora', replace: 'Turkey'},
  {find: 'Belarus', findlocality: 'Antwerp', replace: 'Belgium'},
  {find: 'Ireland', findlocality: 'Armagh', replace: 'United Kingdom'},
  {find: 'Georgia', findlocality: 'Atlanta', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Atlanta', replace: 'United States'},
  {find: 'United Arab Emirates', findlocality: 'Baghdad', replace: 'Iraq'},
  {find: 'Azerbaijan Republic', findlocality: 'Baku', replace: 'Azerbaijan'},
  {find: 'Brunei Darussalam', findlocality: 'Bandar Seri Begawan', replace: 'Brunei'},
  {find: 'Andorra', findlocality: 'Barcelona', replace: 'Spain'},
  {find: 'Congo', findlocality: 'Barcelona', replace: 'Spain'},
  {find: 'Azerbaijan Republic', findlocality: 'Beijing', replace: 'China'},
  {find: 'Hong Kong', findlocality: 'Beijing', replace: 'China'},
  {find: 'Benin', findlocality: 'Beijing', replace: 'China'},
  {find: 'Armenia', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Angola', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Afghanistan', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Aruba', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Venezuela', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Greece', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Austria', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Bangladesh', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Belarus', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Brazil', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Australia', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Croatia', findlocality: 'Berlin', replace: 'Germany'},
  {find: 'Sweden', findlocality: 'Bern', replace: 'Switzerland'},
  {find: 'Austria', findlocality: 'Bern', replace: 'Switzerland'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Bihac', replace: 'Bosnia and Herzegovina'},
  {find: 'Congo', findlocality: 'Bologna', replace: 'Italy'},
  {find: 'Belarus', findlocality: 'Braga', replace: 'Latvia'},
  {find: 'Czech Republic', findlocality: 'Bratislava', replace: 'Slovakia'},
  {find: 'Sweden', findlocality: 'Bremen', replace: 'Germany'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Brest', replace: 'Serbia'},
  {find: 'Austria', findlocality: 'Brno', replace: 'Czech Republic'},
  {find: 'Ethiopia', findlocality: 'Brooklyn', replace: 'United States'},
  {find: 'Ukraine', findlocality: 'Brooklyn', replace: 'United States'},
  {find: 'Uruguay', findlocality: 'Brooklyn', replace: 'United States'},
  {find: 'Brunei Darussalam', findlocality: 'Brunei Muara', replace: 'Brunei'},
  {find: 'France', findlocality: 'Brussels', replace: 'Belgium'},
  {find: 'Hong Kong', findlocality: 'Bruxelles', replace: 'Belgium'},
  {find: 'Greece', findlocality: 'Budapest', replace: 'Hungary'},
  {find: 'Denmark', findlocality: 'Budapest', replace: 'Hungary'},
  {find: 'Germany', findlocality: 'Budapest', replace: 'Hungary'},
  {find: 'Armenia', findlocality: 'Buenos Aires', replace: 'Argentina'},
  {find: 'Dominican Republic', findlocality: 'Buenos Aires', replace: 'Argentina'},
  {find: 'Azerbaijan Republic', findlocality: 'Buks', replace: 'Azerbaijan'},
  {find: 'Austria', findlocality: 'Cairo', replace: 'Egypt'},
  {find: 'Argentina', findlocality: 'Caltanissetta', replace: 'Italy'},
  {find: 'United Kingdom', findlocality: 'Cape Town', replace: 'South Africa'},
  {find: 'Spain', findlocality: 'Caracas', replace: 'Venezuela'},
  {find: 'Belarus', findlocality: 'Chernobyl', replace: 'Ukraine'},
  {find: 'American Samoa', findlocality: 'Chicago', replace: 'United States'},
  {find: 'Afghanistan', findlocality: 'Chicago', replace: 'United States'},
  {find: 'Colombia', findlocality: 'Chicago', replace: 'United States'},
  {find: 'Benin', findlocality: 'Citu', replace: 'Nigeria'},
  {find: 'Uruguay', findlocality: 'Ciudad De México', replace: 'Mexico'},
  {find: 'Norway', findlocality: 'Ciudad de México', replace: 'Mexico'},
  {find: 'Italy', findlocality: 'Curitiba', replace: 'Brazil'},
  {find: 'Brasil', findlocality: 'Curitiba', replace: 'Brazil'},
  {find: 'Davao Region', findlocality: 'Davao', replace: 'Philippines'},
  {find: 'Azerbaijan Republic', findlocality: 'Delhi', replace: 'India'},
  {find: 'United Kingdom', findlocality: 'Doha', replace: 'Qatar'},
  {find: 'Afghanistan', findlocality: 'Dubai', replace: 'United Arab Emirates'},
  {find: 'Belgium', findlocality: 'Dunkerque', replace: 'France'},
  {find: 'Germany', findlocality: 'Elliottsburg', replace: 'United States'},
  {find: 'Georgia', findlocality: 'Ering', replace: 'Germany'},
  {find: 'Georgia', findlocality: 'Evans', replace: 'United States'},
  {find: 'Bahamas', findlocality: 'Fasgaerghe', replace: 'The Bahamas'},
  {find: 'Georgia', findlocality: 'Fayetteville', replace: 'United States'},
  {find: 'Greece', findlocality: 'Ferno', replace: 'Italy'},
  {find: 'Belarus', findlocality: 'Firenze', replace: 'Italy'},
  {find: 'Andorra', findlocality: 'Firenze', replace: 'Italy'},
  {find: 'Ireland', findlocality: 'Fort Johnson', replace: 'United States'},
  {find: 'France', findlocality: 'Fort-de-France Bay', replace: 'Martinique'},
  {find: 'Barbados', findlocality: 'Frankfurt', replace: 'Germany'},
  {find: 'Australia', findlocality: 'Frankfurt', replace: 'Germany'},
  {find: 'Bahamas', findlocality: 'Freeport', replace: 'The Bahamas'},
  {find: 'egypt', findlocality: 'Giza', replace: 'Egypt'},
  {find: 'American Samoa', findlocality: 'Glendale', replace: 'United States'},
  {find: 'Barbados', findlocality: 'Glendale', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Guadalupe', replace: 'Mexico'},
  {find: 'Azerbaijan Republic', findlocality: 'Hagen', replace: 'Netherlands'},
  {find: 'Afghanistan', findlocality: 'Hamburg', replace: 'Germany'},
  {find: 'Afghanistan', findlocality: 'Hamilton', replace: 'United States'},
  {find: 'United Kingdom', findlocality: 'Havana', replace: 'Cuba'},
  {find: 'Brazil', findlocality: 'Haverhill', replace: 'United States'},
  {find: 'Brazil', findlocality: 'Helsinki', replace: 'Finland'},
  {find: 'Angola', findlocality: 'Hgaak', replace: 'Singapore'},
  {find: 'China', findlocality: 'Hk', replace: 'Hong Kong'},
  {find: 'Spain', findlocality: 'Ho Chi Minh City', replace: 'Vietnam'},
  {find: 'China', findlocality: 'Hong Kong', replace: 'Hong Kong'},
  {find: 'France', findlocality: 'Hong Kong', replace: 'Hong Kong'},
  {find: 'China', findlocality: 'Hongkong', replace: 'Hong Kong'},
  {find: 'Australia', findlocality: 'Houston', replace: 'United States'},
  {find: 'Belarus', findlocality: 'Houston', replace: 'United States'},
  {find: 'British Virgin Islands', findlocality: 'Houston', replace: 'United States'},
  {find: 'austria', findlocality: 'Imst', replace: 'Austria'},
  {find: 'Afghanistan', findlocality: 'Karachi', replace: 'Pakistan'},
  {find: 'Andorra', findlocality: 'Kuala Lumpur', replace: 'Malaysia'},
  {find: 'france', findlocality: "L'huisserie", replace: 'France'},
  {find: 'China', findlocality: 'La', replace: 'United States'},
  {find: 'Germany', findlocality: 'Lech', replace: 'Austria'},
  {find: 'Ukraine', findlocality: 'Leipzig', replace: 'Germany'},
  {find: 'austria', findlocality: 'Linz', replace: 'Austria'},
  {find: 'France', findlocality: 'Liège', replace: 'Belgium'},
  {find: 'Anguilla', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Lithuania', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Poland', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Albania', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Italy', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Pakistan', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Engli', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Ethiopia', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Denmark', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Japan', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Czech Republic', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Austria', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'China', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Azerbaijan Republic', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Cambodia', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'South Korea', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Afghanistan', findlocality: 'London', replace: 'Canada'},
  {find: 'Angola', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Bangladesh', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Barbados', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Algeria', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Colombia', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Ireland', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Germany', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Hungary', findlocality: 'London', replace: 'Canada'},
  {find: 'Brazil', findlocality: 'London', replace: 'Canada'},
  {find: 'Spain', findlocality: 'London', replace: 'United Kingdom'},
  {find: 'Bahamas', findlocality: 'Longtown', replace: 'The Bahamas'},
  {find: 'Iceland', findlocality: 'Los Angeles', replace: 'United States'},
  {find: 'Grenada', findlocality: 'Los Angeles', replace: 'United States'},
  {find: 'United Arab Emirates', findlocality: 'Los Angeles', replace: 'United States'},
  {find: 'China', findlocality: 'Macau', replace: 'Macau'},
  {find: 'Argentina', findlocality: 'Madrid', replace: 'Spain'},
  {find: 'Ireland', findlocality: 'Manchester Township', replace: 'United States'},
  {find: 'Virgin Islands (U.S.)', findlocality: 'Marseille', replace: 'France'},
  {find: 'Botswana', findlocality: 'Melbourne', replace: 'Australia'},
  {find: 'Argentuza', findlocality: 'Mendoika', replace: 'Argentina'},
  {find: 'Colombia', findlocality: 'Miami', replace: 'United States'},
  {find: 'France', findlocality: 'Miami', replace: 'United States'},
  {find: 'Bahamas', findlocality: 'Milano', replace: 'Italy'},
  {find: 'Afghanistan', findlocality: 'Milano', replace: 'Italy'},
  {find: 'Burma', findlocality: 'Mogok', replace: 'Myanmar (Burma)'},
  {find: 'American Samoa', findlocality: 'Monroe Township', replace: 'United States'},
  {find: 'Argentina', findlocality: 'Montevideo', replace: 'Uruguay'},
  {find: 'Algeria', findlocality: 'Montreal', replace: 'Canada'},
  {find: 'Bangladesh', findlocality: 'Montrweal', replace: 'Canada'},
  {find: 'Zimbabwe', findlocality: 'Moscow', replace: 'Russia'},
  {find: 'Belarus', findlocality: 'Moscow', replace: 'Russia'},
  {find: 'Australia', findlocality: 'Moskva', replace: 'Russia'},
  {find: 'Afghanistan', findlocality: 'Moskva', replace: 'Russia'},
  {find: 'Latvia', findlocality: 'Moskva', replace: 'Russia'},
  {find: 'Bangladesh', findlocality: 'Nantes', replace: 'France'},
  {find: 'China', findlocality: 'Oak Ridge', replace: 'United States'},
  {find: 'Germany', findlocality: 'Oakland', replace: 'United States'},
  {find: 'Turkey', findlocality: 'Orlando', replace: 'United States'},
  {find: 'Sweden', findlocality: 'Osaka', replace: 'Japan'},
  {find: 'Afghanistan', findlocality: 'Osko', replace: 'Norway'},
  {find: 'Angola', findlocality: 'Padova', replace: 'Italy'},
  {find: 'Argentina', findlocality: 'Paris', replace: 'France'},
  {find: 'Germany', findlocality: 'Paris', replace: 'France'},
  {find: 'Azerbaijan Republic', findlocality: 'Paris', replace: 'France'},
  {find: 'Switzerland', findlocality: 'Paris', replace: 'France'},
  {find: 'American Samoa', findlocality: 'Paris', replace: 'Frances'},
  {find: 'Argentina', findlocality: 'Paris/barcelona', replace: 'France'},
  {find: 'France', findlocality: 'Pendleton', replace: 'United States'},
  {find: 'Barbados', findlocality: 'Pennsilvanyia', replace: 'United States'},
  {find: 'France', findlocality: 'Perdu', replace: 'Spain'},
  {find: 'Uganda', findlocality: 'Portland', replace: 'United States'},
  {find: 'Vietnam', findlocality: 'Portland', replace: 'United States'},
  {find: 'Taiwan', findlocality: 'Prague', replace: 'Czech Republic'},
  {find: 'Azerbaijan Republic', findlocality: 'Prague', replace: 'Czech Republic'},
  {find: 'Cape Verde Islands', findlocality: 'Praia', replace: 'Cape Verde'},
  {find: 'Albania', findlocality: 'Prato', replace: 'Italy'},
  {find: 'Croatia, Republic Of', findlocality: 'Pula', replace: 'Croatia'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Rajvosa', replace: 'Bosnia and Herzegovina'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Republika Srpska', replace: 'Bosnia and Herzegovina'},
  {find: 'Croatia, Republic Of', findlocality: 'Rijeka', replace: 'Croatia'},
  {find: 'Syria', findlocality: 'Riyadh', replace: 'Saudi Arabia'},
  {find: 'American Samoa', findlocality: 'Roma', replace: 'Italy'},
  {find: 'Iceland', findlocality: 'Roma', replace: 'Italy'},
  {find: 'Afghanistan', findlocality: 'Roma', replace: 'Italy'},
  {find: 'Honduras', findlocality: 'Roma', replace: 'Italy'},
  {find: 'Angola', findlocality: 'Roma', replace: 'Italy'},
  {find: 'Ukraine', findlocality: 'Rome', replace: 'Italy'},
  {find: 'Turkey', findlocality: 'Rotterdam', replace: 'Netherlands'},
  {find: 'France', findlocality: 'Saint Pierre De La Réunion', replace: 'Reunion'},
  {find: 'Croatia, Republic Of', findlocality: 'Samobor', replace: 'Croatia'},
  {find: 'Angola', findlocality: 'San Andreas', replace: 'Mexico'},
  {find: 'India', findlocality: 'San Diego', replace: 'United States'},
  {find: 'American Samoa', findlocality: 'San Diego', replace: 'United States'},
  {find: 'United Kingdom', findlocality: 'San Francisco', replace: 'United States'},
  {find: 'Germany', findlocality: 'San Jose', replace: 'United States'},
  {find: 'Andorra', findlocality: 'Sao Paulo', replace: 'Brazil'},
  {find: 'Argentina', findlocality: 'Sao Paulo', replace: 'Brazil'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Sarajevo', replace: 'Bosnia and Herzegovina'},
  {find: 'austria', findlocality: 'Sbg', replace: 'Austria'},
  {find: 'Switzerland', findlocality: 'Seattle', replace: 'United States'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Sekovici', replace: 'Bosnia and Herzegovina'},
  {find: 'Bosnia and Herzegovina', findlocality: 'Ship', replace: 'Bosnia & Herzegovina'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Ship', replace: 'Bosnia & Herzegovina'},
  {find: 'China', findlocality: 'Singapore', replace: 'Singapore'},
  {find: 'India', findlocality: 'Singapore', replace: 'Singapore'},
  {find: 'Burma', findlocality: 'Singapore', replace: 'Singapore'},
  {find: 'France', findlocality: 'Singapore', replace: 'Singapore'},
  {find: 'Croatia, Republic Of', findlocality: 'Spalato', replace: 'Croatia'},
  {find: 'France', findlocality: 'St Pierre', replace: 'Saint Pierre and Miquelon'},
  {find: 'Virgin Islands (U.S.)', findlocality: 'St.thomas', replace: 'U.S. Virgin Islands'},
  {find: 'Bangladesh', findlocality: 'Stockholm', replace: 'Sweden'},
  {find: 'France', findlocality: 'Stratton', replace: 'United Kingdom'},
  {find: 'Antigua And Barbuda', findlocality: 'Strsnd', replace: 'Antigua and Barbuda'},
  {find: 'Bangladesh', findlocality: 'Sydney', replace: 'Australia'},
  {find: 'Austria', findlocality: 'Taipei', replace: 'Taiwan'},
  {find: 'China', findlocality: 'Taipei', replace: 'Taiwan'},
  {find: 'China', findlocality: 'Taiwan', replace: 'Taiwan'},
  {find: 'Turkey', findlocality: 'Tallinn', replace: 'Estonia'},
  {find: 'India', findlocality: 'Tehran', replace: 'Iran'},
  {find: 'Indonesia', findlocality: 'Tehran', replace: 'Iran'},
  {find: 'Afghanistan', findlocality: 'Tehran', replace: 'Iran'},
  {find: 'Botswana', findlocality: 'Tokyo', replace: 'Japan'},
  {find: 'Afghanistan', findlocality: 'Tokyo', replace: 'Japan'},
  {find: 'China', findlocality: 'Tokyo', replace: 'United States'},
  {find: 'Germany', findlocality: 'Tokyo', replace: 'Japan'},
  {find: 'Brazil', findlocality: 'Tokyo', replace: 'Japan'},
  {find: 'Algeria', findlocality: 'Tokyo', replace: 'Japan'},
  {find: 'China', findlocality: 'Toronto', replace: 'Canada'},
  {find: 'Afghanistan', findlocality: 'Toronto', replace: 'Canada'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Travnik', replace: 'Bosnia and Herzegovina'},
  {find: 'Bulgaria', findlocality: 'Tromso', replace: 'Norway'},
  {find: 'argentina', findlocality: 'Tucuman', replace: 'Argentina'},
  {find: 'Bosnia And Herzegovina', findlocality: 'Tuzla', replace: 'Bosnia and Herzegovina'},
  {find: 'China', findlocality: 'Utrecht', replace: 'Netherlands'},
  {find: 'Vatican City State', findlocality: 'Vatican', replace: 'Vatican City'},
  {find: 'Germany', findlocality: 'Vienna', replace: 'Austria'},
  {find: 'austria', findlocality: 'Vienna', replace: 'Austria'},
  {find: 'China', findlocality: 'Vienna', replace: 'Austria'},
  {find: 'Austria', findlocality: 'Vigo', replace: 'Italy'},
  {find: 'Engli', findlocality: 'Villach', replace: 'Guatemala'},
  {find: 'Belarus', findlocality: 'Vilnius', replace: 'Lithuania'},
  {find: 'Bangladesh', findlocality: 'Warszawa', replace: 'Poland'},
  {find: 'Bahamas', findlocality: 'Washington', replace: 'United States'},
  {find: 'Thailand', findlocality: 'Washington', replace: 'United States'},
  {find: 'Germany', findlocality: 'Washington', replace: 'United States'},
  {find: 'Saint Kitts-Nevis', findlocality: 'Westham', replace: 'Germany'},
  {find: 'Algeria', findlocality: 'Wien', replace: 'Austria'},
  {find: 'Colombia', findlocality: 'Wien', replace: 'Austria'},
  {find: 'Russia', findlocality: 'Wilmington', replace: 'United States'},
  {find: 'Greece', findlocality: 'Wilminton', replace: 'United States'},
  {find: 'Canada', findlocality: 'Wuxi', replace: 'China'},
  {find: 'Burma', findlocality: 'Yangon', replace: 'Myanmar (Burma)'},
  {find: 'Bangladesh', findlocality: 'Zagabria', replace: 'Croatia'},
  {find: 'Croatia, Republic Of', findlocality: 'Zagreb', replace: 'Croatia'},
  {find: 'Bosnia and Herzegovina', findlocality: 'Zaugline', replace: 'Serbia'},
  {find: 'Croatia, Republic Of', findlocality: 'Zgb', replace: 'Croatia'},
  {find: 'France', findlocality: 'Zion', replace: 'United States'},
  {find: 'Albania', findlocality: 'Zürich', replace: 'Switzerland'},
  {find: 'Canada', findlocality: '河西区', replace: 'China'},
  {find: 'Australia', findlocality: '洛杉矶', replace: 'United States'},
];
for(var b=0;b<fix.length;b++){
  printjson(fix[b]);
  db.users.find({"addresses.country": fix[b].find, "addresses.locality": fix[b].findlocality},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].country == fix[b].find && e.addresses[a].locality == fix[b].findlocality) e.addresses[a].country = fix[b].replace;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"country": fix[b].find, "locality": fix[b].findlocality}).forEach(function(e) {
    e.country = fix[b].replace;
    var save = db.addressdbs.save(e);
    if (save.getWriteError() && save.getWriteError().code == 11000) {
      printjson("REMOVEEEEE");
      db.addressdbs.remove({_id: e._id});
    }
  });
}
  
// countryfix
var fix = [
  {findlocality: 'Baghdad', replace: 'Iraq'},
  {findlocality: 'Barcellona', replace: 'Spain'},
  {findlocality: 'Berlin', replace: 'Germany'},
  {findlocality: 'Barcelona', replace: 'Spain'}
];
for(var b=0;b<fix.length;b++){
  printjson(fix[b]);
  db.users.find({"addresses.locality": fix[b].findlocality},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        if (e.addresses[a].locality == fix[b].findlocality) e.addresses[a].country = fix[b].replace;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"locality": fix[b].findlocality}).forEach(function(e) {
    e.country = fix[b].replace;
    var save = db.addressdbs.save(e);
    if (save.getWriteError() && save.getWriteError().code == 11000) {
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




// countryfix #2
var fix = [
  {locality: 'New York', replacecountry: 'United States'},
];

for(var b=0;b<fix.length;b++){
  db.users.find({"addresses.locality": fix[b].locality},{addresses: 1}).forEach(function(e) {
    if (e.addresses && e.addresses.length) {
      for(var a=0;a<e.addresses.length;a++){
        e.addresses[a].country = fix[b].replacecountry;
      }
    }
    db.users.update({_id: e._id}, {$set: {addresses: e.addresses}}, { upsert: true });
  });
  db.addressdbs.find({"locality": fix[b].locality}).forEach(function(e) {
    e.country = fix[b].replacecountry;
    var save = db.addressdbs.save(e);
    if (save.getWriteError() && save.getWriteError().code == 11000) {
      printjson("REMOVEEEEE");
      db.addressdbs.remove({_id: e._id});
    }  
  });
}

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
  
  

db.videos.find({}).forEach(function(video) {
  var search = video.media.file;
  var res = db.tvshows.find({"media.file":search}).toArray();
  printjson(res.length);
  var conta = 0;
  if (res.length) {
    res.forEach(function(e) {
      if (!e.categories) e.categories = [];
      e.categories = e.categories.concat(video.categories);
      e.programming = video.programming;
      e.stats.visits+= video.stats.visits;
      e.stats.likes+= video.stats.likes;
      e.stats.visits+= video.stats.visits;
      delete e.stats.img;
      if (video.text) {
        e.abouts = [];
        for (var item in video.text) {
          var tmp = {};
          tmp.lang = item;
          tmp.abouttext = video.text[item];
          e.abouts.push(tmp);
        }
      }
      for (var a=0; a<video.users.length; a++) {
        var add = true;
        for (var b=0; b<e.users.length; b++) {
          if(e.users[b].toString()==video.users[a].toString()) {
            add = false;
          }
        }
        if(add) {
          e.users.push(video.users[a]);
        }
      }
    
      //printjson(e);
      for(var item in video) {
        /*
        printjson(item);
        printjson(video[item]);
        printjson(e[item]);
        printjson("------------------------");
        */
      }
      //db.videos.save(e);
    });  
  } else {
    if (video.text) {
      video.abouts = [];
      for (var item in video.text) {
        var tmp = {};
        tmp.lang = item;
        tmp.abouttext = video.text[item];
        video.abouts.push(tmp);
      }
      delete video.text;
    }
    db.videos.save(video);
    printjson(video);
  }
});

db.users.find({"slug": "gianlucadelgobbo"}, {news: 1}).forEach(function(e) {
  e.news = [];
  printjson(e);
  var res = db.news.find({"users": e._id}, {_id: 1}).toArray();
  var conta = 0;
  res.forEach(function(news) {
    e.news.push(news._id);
    conta++;
    printjson(conta);
    printjson(res.length);
    if (conta == res.length) {
      printjson(e.news);
      db.users.update({_id: e._id}, {$set: {news: e.news}}, { upsert: true });
    }
  });  
});

db.users.find({"slug": "gianlucadelgobbo"}, {videos: 1}).forEach(function(e) {
  e.videos = [];
  printjson(e);
  var res = db.videos.find({"users": e._id}, {_id: 1}).toArray();
  var conta = 0;
  res.forEach(function(videos) {
    e.videos.push(videos._id);
    conta++;
    printjson(conta);
    printjson(res.length);
    if (conta == res.length) {
      printjson(e.videos);
      db.users.update({_id: e._id}, {$set: {videos: e.videos}}, { upsert: true });
    }
  });  
});
















db.users.findOne({"links": {$exists: true}});
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



db.playlists.update({"users.0":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.playlists.find({"users.0":{$exists:false}}, {"users": 1});

db.playlists.find({"footage.0": {$exists: false}});
db.playlists.remove({"footage.0": {$exists: false}});



db.playlists.find({}).forEach(function(e) {
  e.image = {file: e.footage[0].file};
  db.playlists.save(e);
});


db.videos.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.playlists.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.galleries.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.footage.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.performances.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);
db.events.update({"users._id":{$exists:false}}, {$set: {"users":[{"old_id":"39417"}]}},false,true);

db.performances.find({"files.file":{'$regex': '90x68/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('90x68/','');
  db.performances.save(e);
});
db.galleries.find({"files.file":{'$regex': '128x96/'}}).forEach(function(e) {
  e.files[0].file = e.files[0].file.replace('128x96/','');
  db.galleries.save(e);
});




//db.runCommand ( { distinct: 'users',key: 'locations'} )
//db.categories.find({"ancestors" :{$exists:false},"ancestor_old_id":{$ne:"0"}});

//{surname:"Del Gobbo"}
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