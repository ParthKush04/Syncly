export function getHealth(req, res) {
  res.json({
    message: 'API is healthy',
    status: 'ok'
  });
}
