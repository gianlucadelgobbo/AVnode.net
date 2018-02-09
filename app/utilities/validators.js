const Validators = {};

// General Functions //
Validators.validateStringLength = function validateStringLength (str, min, max) {
  return str.length <= max && str.length >= min;
}:

Validators.isEmail = function isEmail (e) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(e);
};

Validators.isSlug = function isSlug (e) {
  const re = /^[aA-zZ0-9]+(?:-[aA-zZ0-9]+)*$/;

  return re.test(e);
};

Validators.isDate = function isDate (aaaa, mm, gg){
  let res = true;
  const mmNew = parseFloat(mm)-1;
  const dteDate = new Date(aaaa, mm, gg);
  const mmm = mmNew.toString().length === 1 ? '0' + mmNew : mmNew;

  if (!(gg==dteDate.getDate() && mmm === dteDate.getMonth() && aaaa === dteDate.getFullYear())) {
    res = false;
  }

  return res;
}

if (typeof exports !== 'undefined') exports.Validators = Validators;
