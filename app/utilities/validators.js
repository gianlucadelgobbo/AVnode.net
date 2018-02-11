const validators = {};

// General Functions //
validators.validateStringLength = (str, min, max) => {
  return str.length <= max && str.length >= min;
};

validators.isEmail = (e) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(e);
};

validators.isUrl = (e) => {
  const re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return re.test(e);
}

validators.isSlug = (e) => {
  const re = /^[aA-zZ0-9]+(?:-[aA-zZ0-9]+)*$/;
  return re.test(e);
};

validators.isDate = (aaaa, mm, gg) => {
  let res = true;
  const mmNew = parseFloat(mm)-1;
  const dteDate = new Date(aaaa, mm, gg);
  const mmm = mmNew.toString().length === 1 ? '0' + mmNew : mmNew;

  if (!(gg==dteDate.getDate() && mmm === dteDate.getMonth() && aaaa === dteDate.getFullYear())) {
    res = false;
  }

  return res;
};

if (typeof exports !== 'undefined') {
  exports.Validators = Validators;
}
