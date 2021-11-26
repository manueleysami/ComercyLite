module.exports = {
  autenticacion: (req, res, next) => {
    !req.session.usuario ? res.redirect('/admin/login') : next();
  },
};
