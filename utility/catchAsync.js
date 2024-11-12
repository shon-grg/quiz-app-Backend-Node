module.exports = fn(async (req, res) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
});
