const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    create: function (req, res, next) {

        userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "User added successfully", data: null });

        });
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({ status: "success", message: "user found", data: { user: userInfo, token: token } });
                } else {
                    res.json({ status: "error", message: "Invalid email/password", data: null });
                }
            }
        });
    },
    me: function(req,res){
        jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(
            err,
            decoded
          ) {
            if (err) {
              res.json({ status: "error", message: err.message, data: null });
            } else {
              var userId = decoded.id;
              userModel.findById(userId, function(err, userInfo) {
                if (err) {
                  next(err);
                } else {
                  res.json({
                    message: "My info",
                    data: { user: userInfo }
                  });
                }
              });
            
            }
          });
    },
    logout: function (req, res, next){
        jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(
            err,
            decoded
          ) {
            if (err) {
              res.json({ status: "error", message: err.message, data: null });
            } else {
        return res.status(500).send({auth: false, token: null})
            }
        });
    },
}