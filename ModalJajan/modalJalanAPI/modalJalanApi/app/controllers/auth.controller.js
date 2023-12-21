const db = require("../models");
const config = require("../config/auth.config");
const Users = db.Users;
// const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Fungsi signup
exports.signup = async (req, res) => {
  // Simpan ke databases
  try {
    const user = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    res.send({ message: "Berhasil melakukan registrasi" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//fungsi Login signin

exports.signin = async (req, res) => {
  try {
    //cari username
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Username tidak ditemukan!" });
    }
    //verifikasi password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Password salah, Silahkan Coba lagi",
      });
    }
    //token jwt
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });
    req.session.token = token;
    // jika Login berhasil
    return res.status(200).send({
      message: "Login Berhasil ",
      tokenSession: token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//Fungsi Logout

exports.signout = async (req, res) => {
  try {
    //hapus session
    req.session = null;
    return res.status(200).send({
      message: "Anda telah keluar",
    });
  } catch (err) {
    this.next(err);
  }
};
