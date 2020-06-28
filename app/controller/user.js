'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async update() {
    const ctx = this.ctx;
    const res = await ctx.service.user.update(ctx.request.body);
    ctx.body = res;
  }
}

module.exports = UserController;
