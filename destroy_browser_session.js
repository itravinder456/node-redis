module.exports = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', { expires: new Date(0) });
        }
        res.redirect("/")
    });

};
