// Cek apabila user belum login sebelumnnya maka user tidak bisa langsung masuk ke halaman dashboard.
const isLogin = (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
        req.flash("alertMessage", "Session telah habis silahkan sign in ulang!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
    } else {
        next();
    }
};

module.exports = isLogin;