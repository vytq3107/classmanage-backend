const {
  parsePhoneNumberFromString,
  isPossiblePhoneNumber
} = require('libphonenumber-js');

function validatePhone(field = 'phone', source = 'body') {
  return function (req, res, next) {
    const data = req[source];

    if (!data) {
      return res.status(400).json({
        message: `Missing data '${source}'`
      });
    }

    const { type, identifier } = data;
    const isEmail = type === 'email' || (typeof identifier === 'string' && identifier.includes('@'));

    if (isEmail) {
      return next();
    }

    const raw = data?.[field];

    if (!raw || typeof raw !== 'string') {
      return res.status(400).json({
        message: `'${field}' is required and must be a string`
      });
    }

    const hasPlus = raw.startsWith('+');
    const defaultCountry = 'VN';
    let phone;

    try {
      phone = hasPlus
        ? parsePhoneNumberFromString(raw)
        : parsePhoneNumberFromString(raw, defaultCountry);
    } catch {
      return res.status(400).json({
        message: `Invalid phone format: '${raw}'`
      });
    }

    if (!phone || !phone.isValid()) {
      return res.status(400).json({
        message: `Invalid phone number: '${raw}'`
      });
    }

    let normalized = phone.nationalNumber;
    if (phone.country === 'VN' && !normalized.startsWith('0')) {
      normalized = '0' + normalized;
    }

    req[source][field] = normalized;
    next();
  };
}

module.exports = {
  validatePhone
};
