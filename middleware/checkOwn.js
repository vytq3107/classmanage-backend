const checkOwn = (field = 'phone', source = 'params') => {
  return (req, res, next) => {
    const { role, phone: requesterPhone } = req.user || {};
    const targetPhone = req[source]?.[field];

    console.log('targetPhone:', targetPhone);


    if (role === 'stu' && requesterPhone !== targetPhone) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    next();
  };
};

module.exports = checkOwn;
