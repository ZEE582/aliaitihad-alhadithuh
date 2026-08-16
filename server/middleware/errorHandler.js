const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation error', details: err.errors });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Duplicate entry', details: err.errors });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Invalid reference', details: err.errors });
  }

  res.status(500).json({ message: 'Something went wrong!', error: err.message });
};

module.exports = errorHandler;
