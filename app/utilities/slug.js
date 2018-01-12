module.exports.parse = (str) => {
  const special = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿ'.split('');
  const replace = 'aaaaaceeeeiiiinooooouuuuyy'.split('');
  str = str.toLowerCase();
  special.map((chr, i) => {
    str = str.replace(new RegExp(chr, 'g'), replace[i]);
  });
  return str
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-\_]/g,'')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
