const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const koaStatic = require('koa-static');
const path = require('path');
const FileHandler = require('./api/FileHandler');

const app = new Koa();
const public = path.join(__dirname, '/public');
app.use(koaStatic(public));

exports.public = public;
const port = process.env.PORT || 3000;
const fileHandler = new FileHandler();

app.use(cors());
app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true
}))

app.use(async (ctx) => {
  if (ctx.request.method === 'GET') {
    console.log(ctx.request);
  }
  const { method } = ctx.request.query;
  let result;
  switch (method) {
    case 'saveImage':
      try {
        const { image } = ctx.request.files;
        result = fileHandler.saveImage(image)
        ctx.response.body = result;
      }
      catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.response.body = `Ошибка добавления изображения. ${err.message}`
      }
      return;
    case 'allImages':
      try {
        result = fileHandler.allImages();
        ctx.response.body = result;
      }
      catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.response.body = `Internal error. ${err.message}`
      }
      return;
    case 'removeImage':
      try {
        const { id } = ctx.request.body;
        result = fileHandler.removeImage(id);
        ctx.response.body = result;
      }
      catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.response.body = `Ошибка удаления изображения. ${err.message}`
      }
      return;
    default:
      ctx.response.body = `Method "${method}" is not known.`;
      ctx.response.status = 404;
      return;
  }
})

exports.start = async () => {
  try {
    http.createServer(app.callback()).listen(port);
    console.log(`The server is running on port ${port}`);
    console.log('http://localhost:3000')
    console.log('https://coursar.herokuapp.com/ deployed to Heroku/');
  }
  catch (err) {
    console.log(err);
  }
}

