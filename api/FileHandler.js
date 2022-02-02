const { v4: uuidv4 } = require('uuid');
const server = require('../server');
const fs = require('fs');
const path = require('path')

module.exports = class FileHandler {
  constructor() {
    this.memory = new Map();
  }
  
  saveImage(data) {
    const id = uuidv4();
    const extension = data.name.slice(data.name.lastIndexOf('.'), data.name.length);
    const fileName = id + extension;
    const url = path.join(server.public, fileName);
    const file = fs.readFileSync(data.path, 'binary');
    fs.writeFileSync(url, file, 'binary');
    this.memory.set(id, url);
    console.log('Файл сохранён');
    return { fileName };
  }

  allImages() {
    const arr = [];
    this.memory.forEach((value) => {
      const temp = value.split('/');
      arr.push({ fileName: temp[temp.length - 1] });
    });
    console.log('Массив данных сформирован');
    return arr;
  }

  removeImage(id) {
    if (this.memory.has(id)) {
      fs.unlinkSync(this.memory.get(id));
      this.memory.delete(id);
      console.log('Файл удалён');
      return { success: true };
    }
    console.log('Ошибка удаления');
    return { success: false };
  }
}