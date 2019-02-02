const sharp = require('sharp');
const fs = require('fs');
const logger = require('./logger');
let counter = 0;
let counterresizes = 0;

const image = {};

image.resizer = (files, options, done) => {
  console.log('resizer');
  counter = 0;
  image.resizeAct(files, options, (resizeActErr, info) => {
    done(resizeActErr, info);
  });
};

image.resizeAct = (files, options, done) => {
  console.log('resizeAct');
  counterresizes = 0;
  console.log(options);
  let sizesA = [];
  for (let item in options.sizes) sizesA.push(options.sizes[item]);

  image.resize(files[counter].path, sizesA, (resizeerr, info) => {
    counter++;
    if (resizeerr) {
      done(resizeerr, info);
    } else {
      if (counter === files.length) {
        done(resizeerr, info);
      } else {
        image.resizeAct(files, options, done);
      }
    }
  });
};

image.resize = (file, sizesA, done) => {
  console.log('resize');
  console.log(file);
  const localFileName = file.substring(file.lastIndexOf('/') + 1); // file.jpg this.file.file.substr(19)
  const localPath = file.substring(0, file.lastIndexOf('/')).replace('/glacier/', '/warehouse/').replace('_originals/', '/'); // /warehouse/2017/03
  const localPathA = localPath.split('/');
  let checkPath = '/';
  for (let a=1; a<localPathA.length; a++) {
    checkPath += localPathA[a]+'/';
    console.log(checkPath);
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
  if (!fs.existsSync(`${localPath}/${sizesA[counterresizes].folder}`)) {
    fs.mkdirSync(`${localPath}/${sizesA[counterresizes].folder}`);
  }
  const localFileNameWithoutExtension = localFileName.substring(0, localFileName.lastIndexOf('.'));
  const localFileNameExtension = localFileName.substring(localFileName.lastIndexOf('.') + 1);
  const scaledFilename = `${localPath}/${sizesA[counterresizes].folder}/${localFileNameWithoutExtension}_${localFileNameExtension}.jpg`;

  console.log('resize in  ' + file);
  console.log('resize out ' + scaledFilename);
  console.log(sizesA);
  sharp(file)
  .resize(sizesA[counterresizes].w, sizesA[counterresizes].h)
  .toFile(scaledFilename, (err, info) => {
    counterresizes++;
    if (err) {
      done(err, info);
    } else {
      if (counterresizes === sizesA.length) {
        done(err, info);
      } else {
        image.resize(file, sizesA, done);
      }
    }
  });
};

module.exports = image;
