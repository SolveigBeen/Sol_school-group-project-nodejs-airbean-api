const Logger  = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  // Log request details
  console.log(`[${timestamp}] ${method} ${url} `, req.body)

  next();
};

export default Logger;