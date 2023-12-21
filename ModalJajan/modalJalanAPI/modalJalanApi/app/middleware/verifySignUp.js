const db = require("../models");
const Users = db.Users;

// Verifikasi Duplikat data
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    let user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Username sudah dipakai",
      });
    }

    // Email
    user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res.status(400).send({
        message: "Email sudah dipakai",
      });
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        message: "Format email salah, Harap isi kembali",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
