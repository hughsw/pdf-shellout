#!/usr/bin/env node

const pdfjsLib = require('pdfjs-dist');

const go = async () => {
  const filename = 'DesignerSpec-SG-009-01.pdf';
  console.log('filename:', filename);
  const pdf = await pdfjsLib.getDocument(filename).promise;
  const page = await pdf.getPage(1);
  const operatorList = await page.getOperatorList();

  const index = 11;
  console.log('op:', operatorList.fnArray[index]);
  const [args0] = operatorList.argsArray[index];
  args0.forEach(item => console.log(JSON.stringify(item)));
  return 0;
};

go()
  .catch(err => {
    console.log('err:', err);
    return 1;
  })
  .then(code => process.exit(code))
