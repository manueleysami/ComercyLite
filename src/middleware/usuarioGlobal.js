module.exports = {
  usuarioGlobal: (req, res, next) => {
    req.session.usuario && (res.locals.usuario = req.session.usuario);
    next();
  },
};
