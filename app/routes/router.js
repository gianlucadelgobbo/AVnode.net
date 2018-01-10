const express = require('express');

module.exports = () => {
  return express.Router({mergeParams: true});
};
