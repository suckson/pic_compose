const sharp = require("sharp");
const ColorThief = require("colorthief");
const ccc = require("color-code-converter");
const colors = process.argv.slice(2);
const dirfile = require("dirfile");
var path = require('path');

dirfile('./source', false,(filePath) => {
  return path.extname(filePath) == '.jpg' || path.extname(filePath) == '.png';
}, (filePath)=> {
  return {
    name : path.basename(filePath),
    filePath : filePath
}
}).then(function(fileList){
  console.log(fileList);//打印文件列表信息
})
.catch(function(err){
  console.log(err);
})

ColorThief.getPalette("./source/target.jpg", 3)
  .then((palette) => {
    data = palette.map((color) => {
      return ccc.dec2code(color);
    });
    data.forEach(async (element, index) => {
      await addTextOnImage(element, index);
    });
  }).then(res => {

    setTimeout(() => {
      sharp("./source/target.jpg")
      .composite([
        {
          input: `./temp/0.png`,
          top: 108,
          left: 70,
        }, {
          input: `./temp/1.png`,
          top: 108,
          left: 292,
        }, {
          input: `./temp/2.png`,
          top: 108,
          left: 528,
        }
      ])
      .toFile("end.png");
    }, 2000);
    console.log(res);
  
  })

async function addTextOnImage(color, index) {
  try {
    const width = 160;
    const height = 160;
    const text = color;
    const svgImage = `
          <svg width="${width}" height="${height}">
                <style>
        .title { fill: #fff; font-size: 32px;}
        </style>
          <circle cx="80" cy="80" r="80" style="stroke:#fff; fill:${color}" /> 
          <text x="50%" y="55%" text-anchor="middle" class="title">${text}</text>
          </svg>
          `;
    const svgBuffer = Buffer.from(svgImage);
    await sharp(svgBuffer).toFile(`./temp/${index}.png`);
  } catch (error) {
    console.log(error);
  }
}
