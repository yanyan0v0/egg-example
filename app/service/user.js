'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async update(data) {
    let res = await this.app.mysql.get('user', { userName: data.userName });
    if (res) {
      res = await this.app.mysql.update('user', data);
      if (res.affectedRows === 1) {
        res = await this.app.mysql.get('user', { userName: data.userName });
        console.log(res);
        return res;
      }
    }
    console.log(res);
    return res;
  }
}

module.exports = UserService;
