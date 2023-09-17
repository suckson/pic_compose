const sharp = require("sharp");
const ColorThief = require("colorthief");
const ccc = require("color-code-converter");
const colors = process.argv.slice(2);
const dirfile = require("dirfile");
var path = require("path");


const position = {
  0: { top: 148,
    left: 70,},
  1: {top: 148,
    left: 292},
  2: {  top: 148,
    left: 528}
}

const makePic = async () => {
  try {
    const allData = []
    const fileList = await dirfile(
      "./source",
      false,
      (filePath) => {
        return (
          path.extname(filePath) == ".jpg" || path.extname(filePath) == ".png"
        );
      },
      (filePath) => {
        return {
          name: path.basename(filePath),
          filePath: filePath,
        };
      }
    );
    fileList.forEach(async img => {
        const colorsArray = await ColorThief.getPalette(img.filePath, 4)
        const colors = colorsArray.map((color) => {
          return ccc.dec2code(color).toUpperCase();
        }).filter((item, index) => {
        return index > 0;
      });
        allData.push({colors, ...img})
    })

    setTimeout(() => {
    console.log(allData);
     allData.forEach((item) => {
      item.mkdata = []
      item.colors.forEach((color, index) => {
        addTextOnImage(color, `${item.name.split('.')[0]}_${index}`)
        item.mkdata.push({index, path: `./temp/${item.name.split('.')[0]}_${index}.png`})
      })
      console.log(`生成缓存图片OK`);
      console.log(item);
      setTimeout(() => makeDATA(item), 1000)
     })
    }, 3000)

  } catch (error) {
    console.log(error);
  }
};
const makeDATA  = (item) => {
    sharp(item.filePath)
      .composite([
        {
          input:item.mkdata[0].path,
          ...position[item.mkdata[0].index]
        },
        {
          input:item.mkdata[1].path,
          ...position[item.mkdata[1].index]
        },
        {
          input:item.mkdata[2].path,
          ...position[item.mkdata[2].index]
        },
      ])
      .toFile(`./target/${item.name.split('.')[0]}_end.png`);
}

async function addTextOnImage(color, name) {
  try {
    const width = 160;
    const height = 160;
    const text = color;
    const svgImage = `
          <svg width="${width}" height="${height}">
                <style>
        .title { fill: #fff; font-size: 32px;font-family:思源黑体 CN}
        </style>
          <circle cx="80" cy="80" r="80" style="stroke:#fff; fill:${color}" /> 
          <text x="50%" y="55%" text-anchor="middle" class="title">${text}</text>
          </svg>
          `;
    const svgBuffer = Buffer.from(svgImage);
    await sharp(svgBuffer).toFile(`./temp/${name}.png`);
  } catch (error) {
    console.log(error);
  }
}
makePic();
