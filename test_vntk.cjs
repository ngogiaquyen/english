const vntk = require('@vntk/dictionary');
const ipaUS = require('ipa-dict/lib/en_US.js');
console.log('IPA for hello:', ipaUS['hello']);
vntk.dictionary('hello', (err, result) => {
  if(err) console.log('Error', err);
  console.log('Meaning for hello:', result);
});
