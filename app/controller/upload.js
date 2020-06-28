'use strict';

const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const Controller = require('egg').Controller;

class UploadController extends Controller {

  async home() {
    console.log();
    this.ctx.body = 'hi.egg';
  }

  async index() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();
    const dirname = '/public/uploadfile/' + new Date().Format('yyyy-MM-dd');
    const filename = `${dirname}/${Date.now()}-${stream.filename}`; // stream对象也包含了文件名，大小等基本信息
    // 文件夹是否存在
    if (!fs.existsSync('app' + dirname)) {
      fs.mkdirSync('app' + dirname);
    }

    // 创建文件写入路径
    const target = path.join('./app', filename);

    const result = await new Promise((resolve, reject) => {
      // 创建文件写入流
      const remoteFileStrem = fs.createWriteStream(target);
      // 以管道方式写入流
      stream.pipe(remoteFileStrem);

      let errFlag = false;
      // 监听error事件
      remoteFileStrem.on('error', err => {
        errFlag = true;
        // 停止写入
        sendToWormhole(stream);
        remoteFileStrem.destroy();
        console.log(err);
        reject(err);
      });

      // 监听写入完成事件
      remoteFileStrem.on('finish', () => {
        if (errFlag) return;
        resolve(filename);
      });
    });

    try {
      const insertRes = await ctx.service.upload.index({
        type: stream.mimeType,
        fileName: stream.filename,
        url: filename,
      });
      if (insertRes.affectedRows === 1) {
        ctx.body = { url: `http://127.0.0.1:7001${result}` };
      } else {
        ctx.body = { data: null, error: '文件插入失败' };
      }
    } catch (err) {
      ctx.body = { data: null, error: '文件插入失败' };
    }

  }
}

module.exports = UploadController;
