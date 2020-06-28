'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.upload.home);
  router.put('/user', controller.user.update);
  router.post('/upload', controller.upload.index);
};
