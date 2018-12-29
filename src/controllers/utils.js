const generator = require('generate-password');

const generatePassword = () => {
  return generator.generate({
    length: 10,
    numbers: true
  });
};

module.exports = {
  generatePassword
};
