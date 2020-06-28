'use strict';

const Service = require('egg').Service;

class FileService extends Service {
  async index(file) {
    const res = await this.app.mysql.insert('file', file);
    return res;
  }
}

module.exports = FileService;
