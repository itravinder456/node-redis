
module.exports = (req, res, next) => {
    try {
        // validate user session
        // INVALID SESSION -> REMOVE BROWSER SESSION
        if (!req.session.user) {
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
                res.send('Your session has been expired.');
            });
        }
        // IF VALID SESSION
        else {
            next();
        }
    } catch (error) {
        return res.status(200).json({
            status: false,
            message: 'Your session has been expired.'
        });
    }
};
