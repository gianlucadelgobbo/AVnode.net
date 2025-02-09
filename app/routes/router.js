import express from 'express';

const createRouter = () => {
  return express.Router({ mergeParams: true });
};

export default createRouter;
