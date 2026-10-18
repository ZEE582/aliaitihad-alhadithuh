const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  const details = isDev ? err.errors : undefined;

  if (err.publicMessage !== undefined) {
    if (status >= 500 && isDev) {
      return res.status(status).json({ message: err.publicMessage, error: err.message });
    }
    return res.status(status).json({ message: err.publicMessage });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation error', details });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Duplicate entry', details });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Invalid reference', details });
  }

  if (status >= 500) {
    if (isDev) {
      return res.status(status).json({ message: 'Something went wrong!', error: err.message });
    }
    return res.status(status).json({ message: 'Server error' });
  }

  res.status(status).json({ message: err.message });
};

module.exports = errorHandler;
