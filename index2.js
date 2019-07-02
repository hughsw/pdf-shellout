#!/usr/bin/env node

const pdfjsLib = require('pdfjs-dist');

const shellfile = async filename => {
  console.log(filename);
  return doPdf({
    tag: filename,
    //  filename,
    pdf: await pdfjsLib.getDocument({
      url: filename,
      disableFontFace: true,
      nativeImageDecoderSupport: 'none',
    }).promise,
  });
};

const shellfileX = async filename => {
  // const filename = 'DesignerSpec-SG-009-01.pdf';
  console.log('filename:', filename);
  const pdf = await pdfjsLib.getDocument(filename).promise;
  return  doPdf({
    filename,
    pdf,
  });
/*

  return;

  const index = 11;
  console.log('op:', operatorList.fnArray[index]);
  const [args0] = operatorList.argsArray[index];
  args0.forEach(item => console.log(JSON.stringify(item)));
  return 0;
*/
};

const range = (start, end, length = end - start) => Array.from({ length }, (_, index) => start + index);

const doPdf = async ({ tag, pdf }) => {
  console.log(tag, 'numPages:', pdf.numPages);

  return Promise.all(range(1, pdf.numPages + 1).map(async pageNum => {
    const page = await pdf.getPage(pageNum);
    return doPage({
      tag: `${tag}::${pageNum}`,
      pdf,
      page,
    });
  }));

/*
  let pageNum = 0;
  while( ++pageNum <= pdf.numPages) {
    const page = await pdf.getPage(pageNum);
    await doPage({
      filename,
      pdf,
      page,
    });
  }
*/
};

const doPage = async ({ tag, pdf, page }) => {
  console.log(tag, 'page:', Object.keys(page));

  const operatorList = await page.getOperatorList();
  console.log(tag, 'operatorList.fnArray.length:', operatorList.fnArray.length, 'operatorList.argsArray.length:', operatorList.argsArray.length);
  const textContext = await page.getTextContent({
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  });
  console.log(tag, 'textContext.items.length:', textContext.items.length);
};

const main = async args => {
  await Promise.all(args.map(shellfile));
  return 0;
};

main(process.argv.slice(2))
  .catch(err => {
    console.log('err:', err);
    return 1;
  })
  .then(code => process.exit(code));
