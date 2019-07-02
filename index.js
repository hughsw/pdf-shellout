#!/usr/bin/env node

const fs = require('fs');
const _ = require('lodash');
const pdfjsLib = require('pdfjs-dist');
// Hack -- they should expose this in pdfjsLib.Util
const { ImageKind } = require('pdfjs-dist/lib/shared/util');
const Jimp = require('jimp');
const sharp = require('sharp');

const filename = 'EXT-250.pdf';
//const filename = 'BAR-100.pdf';
//const filename = 'WhiteLilacs.pdf';


console.log('pdfjsLib.version:', pdfjsLib.version);
console.log('pdfjsLib.keys:', Object.keys(pdfjsLib));
console.log('pdfjsLib.Util.keys:', Object.keys(pdfjsLib.Util));

//const pdfjsLib = pdfjs;

// Setting worker path to worker bundle.
//pdfjsLib.PDFWorker.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.entry.js';
//pdfjsLib.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.entry.js';
//window.PDFJS.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.entry.js';

//console.log('OPS:', JSON.stringify(pdfjsLib.OPS));

//const invOps = _.fromPairs(_.map(pdfjsLib.OPS, (num, key) => [num, key]));
//console.log('invOps:', JSON.stringify(invOps));
//const invOps = Object.fromEntries(Object.keys(pdfjsLib.OPS).map(key => [pdfjsLib.OPS[key], key]));
const invOps = _.fromPairs(Object.keys(pdfjsLib.OPS).map(key => [pdfjsLib.OPS[key], key]));
//console.log('invOps:', JSON.stringify(invOps));

const invImageKind =  _.fromPairs(_.map(ImageKind, (num, key) => [num, key]));
console.log('invImageKind:', JSON.stringify(invImageKind));

//pdfjsLib.disableWorker = true; // due to CORS
const imageOps = [
  /*
    "63": "beginInlineImage",
    "64": "beginImageData",
    "65": "endInlineImage",
    "66": "paintXObject",
    "74": "paintFormXObjectBegin",
    "75": "paintFormXObjectEnd",
    "82": "paintJpegXObject",
    "83": "paintImageMaskXObject",
    "84": "paintImageMaskXObjectGroup",
    "85": "paintImageXObject",
    "86": "paintInlineImageXObject",
    "87": "paintInlineImageXObjectGroup",
    "88": "paintImageXObjectRepeat",
    "89": "paintImageMaskXObjectRepeat",
    "90": "paintSolidColorImageMask",
  */
  pdfjsLib.OPS.beginInlineImage,
  pdfjsLib.OPS.beginImageData,
  pdfjsLib.OPS.endInlineImage,
  pdfjsLib.OPS.paintXObject,
  pdfjsLib.OPS.paintFormXObjectBegin,
  pdfjsLib.OPS.paintFormXObjectEnd,
  pdfjsLib.OPS.paintJpegXObject,
  pdfjsLib.OPS.paintImageMaskXObject,
  pdfjsLib.OPS.paintImageMaskXObjectGroup,
  pdfjsLib.OPS.paintImageXObject,
  pdfjsLib.OPS.paintInlineImageXObject,
  pdfjsLib.OPS.paintInlineImageXObjectGroup,
  pdfjsLib.OPS.paintImageXObjectRepeat,
  pdfjsLib.OPS.paintImageMaskXObjectRepeat,
  pdfjsLib.OPS.paintSolidColorImageMask,
];
console.log('imageOps:', JSON.stringify(imageOps));
//const invOps = _.fromPairs(_.map(pdfjsLib.OPS, (num, key) => [num, key]));
//console.log('invOps:', JSON.stringify(invOps));

const textOps = [
  pdfjsLib.OPS.nextLineSetSpacingShowText,
  pdfjsLib.OPS.nextLineShowText,
  pdfjsLib.OPS.setLeading,
  pdfjsLib.OPS.setLeadingMoveText,
  pdfjsLib.OPS.setTextMatrix,
  pdfjsLib.OPS.setTextRenderingMode,
  pdfjsLib.OPS.setTextRise,
  pdfjsLib.OPS.setCharSpacing,
  pdfjsLib.OPS.setWordSpacing,
  pdfjsLib.OPS.setCharWidthAndBounds,
  pdfjsLib.OPS.showText,
  pdfjsLib.OPS.setFont,
];
const otherOps = [
  //pdfjsLib.OPS.dependency,
  pdfjsLib.OPS.transform,
];

const showTextOps = [
  pdfjsLib.OPS.nextLineSetSpacingShowText,
  pdfjsLib.OPS.nextLineShowText,
  pdfjsLib.OPS.showText,
];

//const imageOps = [
  /*
    "63": "beginInlineImage",
    "64": "beginImageData",
    "65": "endInlineImage",
    "66": "paintXObject",
    "74": "paintFormXObjectBegin",
    "75": "paintFormXObjectEnd",
    "82": "paintJpegXObject",
    "83": "paintImageMaskXObject",
    "84": "paintImageMaskXObjectGroup",
    "85": "paintImageXObject",
    "86": "paintInlineImageXObject",
    "87": "paintInlineImageXObjectGroup",
    "88": "paintImageXObjectRepeat",
    "89": "paintImageMaskXObjectRepeat",
    "90": "paintSolidColorImageMask",
  */
/*
  pdfjsLib.OPS.beginInlineImage,
  pdfjsLib.OPS.beginImageData,
  pdfjsLib.OPS.endInlineImage,
  pdfjsLib.OPS.paintXObject,
  pdfjsLib.OPS.paintFormXObjectBegin,
  pdfjsLib.OPS.paintFormXObjectEnd,
  pdfjsLib.OPS.paintJpegXObject,
  pdfjsLib.OPS.paintImageMaskXObject,
  pdfjsLib.OPS.paintImageMaskXObjectGroup,
  pdfjsLib.OPS.paintImageXObject,
  pdfjsLib.OPS.paintInlineImageXObject,
  pdfjsLib.OPS.paintInlineImageXObjectGroup,
  pdfjsLib.OPS.paintImageXObjectRepeat,
  pdfjsLib.OPS.paintImageMaskXObjectRepeat,
  pdfjsLib.OPS.paintSolidColorImageMask,
];
console.log('imageOps:', JSON.stringify(imageOps));

const otherOps = [
  pdfjsLib.OPS.dependency,
  pdfjsLib.OPS.nextLineSetSpacingShowText,
  pdfjsLib.OPS.nextLineShowText,
  pdfjsLib.OPS.setLeading,
  pdfjsLib.OPS.setLeadingMoveText,
  pdfjsLib.OPS.setTextMatrix,
  pdfjsLib.OPS.setTextRenderingMode,
  pdfjsLib.OPS.setTextRise,
  pdfjsLib.OPS.showText,
  pdfjsLib.OPS.transform,
];
*/

const doFile = async filename => {

  //const pdf = await pdfjsLib.getDocument(filename).promise.then(pdf => pdf);
  const pdf = await pdfjsLib.getDocument({
    url: filename,
    disableFontFace: true,
    //nativeImageDecoderSupport: 'none',
  }).promise;
  console.log('pdf.keys:', Object.keys(pdf));
  console.log('pdf.numPages:', pdf.numPages);

  console.log('pdf._pdfInfo.keys:', Object.keys(pdf._pdfInfo));

  const metaData = await pdf.getMetadata();
  console.log('metaData:', JSON.stringify(metaData));
  if (metaData.metadata) {
    console.log('metaData.metadata:', JSON.stringify(metaData.metadata.getAll()));
  }

  const pageLabels = await pdf.getPageLabels();
  if (pageLabels) {
    console.log('pageLabels.keys:', Object.keys(pageLabels));
    console.log('pageLabels:', JSON.stringify(pageLabels));
  }
  else {
    console.log('pageLabels:', pageLabels);
  }

  const javaScript = await pdf.getJavaScript();
  if (javaScript) {
    console.log('javaScript.keys:', Object.keys(javaScript));
    console.log('javaScript:', JSON.stringify(javaScript));
  }
  else {
    console.log('javaScript:', javaScript);
  }

  const outline = await pdf.getOutline();
  if (outline) {
    console.log('outline.keys:', Object.keys(outline));
    console.log('outline:', JSON.stringify(outline));
  }
  else {
    console.log('outline:', outline);
  }

  const stats = await pdf.getStats();
  if (stats) {
    console.log('stats.keys:', Object.keys(stats));
    console.log('stats:', JSON.stringify(stats));
  }
  else {
    console.log('stats:', stats);
  }

  let pageNum = 0;
  while( ++pageNum <= pdf.numPages) {
    let imageNum = 0;
    console.log();
    console.log(`Page: ${pageNum}  ---------------------------------------`);
    const page = await pdf.getPage(pageNum);
    console.log('page.keys:', Object.keys(page));
    // console.log('page:', JSON.stringify(page));

    const scale = 1;
    const viewport = page.getViewport({ scale });
    //console.log('viewport.keys:', Object.keys(viewport));
    console.log('viewport:', JSON.stringify(viewport));

    console.log('page.view:', JSON.stringify(page.view))

    const textContext = await page.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    });
    console.log('textContext.keys:', Object.keys(textContext));
    //console.log('textContext:', JSON.stringify(textContext));
    let itemNo = -1;
    //textContext.items.forEach(item => console.log(++itemNo, item.str));
    textContext.items.forEach(item => {
      console.log(++itemNo, JSON.stringify(item));
      const isEmpty = item.str.match(/^\s*$/);
      if (isEmpty) return;
      if (item.str.split(/\s+/).join(' ') !== item.str) console.log('spacing:', JSON.stringify(item.str));
    });

    const annotations = await page.getAnnotations();
    console.log('annotations:', JSON.stringify(annotations));

    const operatorList = await page.getOperatorList();
    console.log('operatorList.keys:', Object.keys(operatorList));
    //console.log('operatorList.fnArray:', JSON.stringify(operatorList.fnArray));
    //console.log('operatorList:', JSON.stringify(operatorList));
    console.log('fnArray.length:', operatorList.fnArray.length);
    console.log('fnArray:');
    _.forEach(operatorList.fnArray, (op, index) => {
      const ish =
            _.includes(textOps, op) ? 'textish' :
            _.includes(imageOps, op) ? 'imageish' :
            _.includes(otherOps, op) ? 'otherish' :
            '';
      console.log(' ', pageNum, index, op, invOps[op]);
      //console.log(' ', pageNum, index, op, invOps[op], ish);
      if( op !== pdfjsLib.OPS.showText && (ish === 'textish' || ish === 'otherish' )) {
        console.log(' ', '       ', invOps[op], JSON.stringify(operatorList.argsArray[index]));
      }
      if (showTextOps.includes(op)) {
        const [texts] = operatorList.argsArray[index];
        const parts = [];
        let widthSum = 0;
        texts.forEach(text => {
          //console.log('text:', JSON.stringify(text));
          console.log(' ', '       ', JSON.stringify(text));
          if (_.isFinite(text)) {
            //console.log('   bug:', JSON.stringify(text));
            return;
          }
          const { accent, fontChar, isInFont, isSpace, unicode, width } = text;
          parts.push(unicode);
          widthSum += width;
          if (!isInFont || fontChar !== unicode) {
            //console.log('   ahem:', JSON.stringify(text));
          }});
        console.log(' ', 'unicode:', parts.join(''));
        console.log(' ', 'widthSum:', widthSum);
      }

    });

    continue;

    _.forEach(operatorList.fnArray, async (op, index) => {
    //await Promise.all(_.map(operatorList.fnArray, async (op, index) => {
      //if( op === pdfjsLib.OPS.paintJpegXObject) console.log('yow1');
      //if( op === pdfjsLib.OPS.paintImageXObject) console.log('yow2');
      //console.log(' ', op, invOps[op], _.includes(imageOps, op) ? 'imageish' : '');
      //if( _.includes(imageOps, op)) console.log('yow3');
      if( _.includes(imageOps, op) ) {
        ++imageNum;
        //console.log(' ', imageNum, index, op, invOps[op], _.includes(imageOps, op) ? 'imageish' : '');
        const imageArgs = operatorList.argsArray[index];
        console.log(' ', JSON.stringify(imageArgs));
        const imageName =imageArgs[0];

        const imageInfo = page.objs.get(imageName);
        console.log('imageInfo.keys:', Object.keys(imageInfo));
        const { width, height, kind, data } = imageInfo;
        const kindName = invImageKind[kind];
        console.log(' ',  'image:', imageName, JSON.stringify({ width, height, kind, kindName }));
        //console.log('imageInfo._src:', JSON.stringify(imageInfo._src));
        //console.log('imageInfo:', JSON.stringify(imageInfo));
        console.log('typeof data', typeof data);
        //console.log('data.keys:', Object.keys(data));
        //console.log('data:', _.toString(data));
        console.log('data.size:', _.size(data));
        const basename = `${filename}_image-p${pageNum}-i${imageNum}-${width}x${height}-${kind}_${imageName}`;
        let rgba = null;
        if( kindName === 'RGB_32BPP' ) {
          rgba = data;
        }
        else if( kindName === 'RGB_24BPP' ) {
   //       const sharpImage = await
          const si = sharp(Buffer.from(data), {
            raw: {
              width,
              height,
              channels: 3,
            }
            //          }).toFile(`${basename}.sharp-test.jpg`, cb => null);
          });
          await si.toFile(`${basename}.sharp-test1.png`);
          await si.toFile(`${basename}.sharp-test1.jpeg`);
          await si.toFile(`${basename}.sharp-test1.webp`);

          //fs.writeFileSync(`${basename}.rgb`, data);
          const size = _.size(data);
          const size3 = size/3;
          // assert floor(size3) === size3
          console.log('size:', size, 'size3:', size3);
          //rgba = Buffer.alloc(size3*4, 0xff);
          rgba = Buffer.alloc(size3*4);
          let srcIndex = 0, dstIndex = 0;
          while (srcIndex < size) {
            rgba[dstIndex++] = data[srcIndex++];
            rgba[dstIndex++] = data[srcIndex++];
            rgba[dstIndex++] = data[srcIndex++];
            rgba[dstIndex++] = 0xff;
          }
        }
        else throw new Error(`unhandled kind: ${kind}, kindName: ${kindName}`);

        //          sharp(Buffer.from(data), {
        const sharpImage = sharp(Buffer.from(rgba), {
            raw: {
              width,
              height,
              channels: 4,
            }
            //          }).toFile(`${basename}.sharp-test.jpg`, cb => null);
        });
        await sharpImage.toFile(`${basename}.sharp-test2.jpg`);
        await sharpImage.toFile(`${basename}.sharp-test2.png`);
        await sharpImage.toFile(`${basename}.sharp-test2.webp`);
        //await sharpImage.jpeg({quality:25}).toFile(`${basename}.sharp-test3.jpg`)
        //await sharpImage.png({compressionLevel: 4}).toFile(`${basename}.sharp-test3.png`);

        return;

        //fs.writeFileSync(`${basename}.rgba`, rgba);
        let image = await new Promise((resolve, reject) => new Jimp({ data: rgba, width, height, }, (err, image) => err ? reject(err) : resolve(image)));
/*
            if(err) throw err;
            resolve(image);
          });
        });
*/
        image = image.rgba(true); // set whether PNGs are saved as RGBA (true, default) or RGB (false)
        image = image.filterType(Jimp.PNG_FILTER_AUTO); // set the filter type for the saved PNG
        image = image.deflateLevel(9); // set the deflate level for the saved PNG
        image = image.deflateStrategy(3);
        image = image.quality(70);
        //const png = await Jimp({ data: rgba, width, height, });
        console.log('image.keys:', Object.keys(image));
        console.log('image._quality:', image._quality);

        await image.writeAsync(`${basename}.1.png`);
        await image.writeAsync(`${basename}.1.jpeg`);

        await new Promise((resolve, reject) => image.write(`${basename}.2.png`, (err, ok) => err ? reject(err) : resolve(ok)));
        await new Promise((resolve, reject) => image.write(`${basename}.2.jpeg`, (err, ok) => err ? reject(err) : resolve(ok)));

        const bufjpeg = await new Promise((resolve, reject) => image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => err ? reject(err) : resolve(buffer)));
        console.log('bufjpeg.length:', bufjpeg.length);
        fs.writeFileSync(`${basename}.3.jpeg`, bufjpeg);

        const bufpng = await new Promise((resolve, reject) => image.getBuffer(Jimp.MIME_PNG, (err, buffer) => err ? reject(err) : resolve(buffer)));
        console.log('bufpng.length:', bufpng.length);
        fs.writeFileSync(`${basename}.3.png`, bufpng);
      }
    });

    //    for (var i=0; i < ops.fnArray.length; i++) {
    //        if (ops.fnArray[i] == PDFJS.OPS.paintJpegXObject) {
  }

  console.log();
  const stats2 = await pdf.getStats();
  if (stats2) {
    console.log('stats2.keys:', Object.keys(stats2));
    console.log('stats2:', JSON.stringify(stats2));
  }
  else {
    console.log('stats2:', stats2);
  }
};

const main = async args => {
  console.log('args:', JSON.stringify(args));

  await Promise.all(_.map(args, doFile));

  return 0;
};

main(process.argv.slice(2))
  .then(code => {
    console.log(`main: code: ${code}`);
    process.exit(code);
  })
  .catch(err => {
    console.log(`main: err: ${err}`);
    console.log(err.stack);
    process.exit(1);
  });
