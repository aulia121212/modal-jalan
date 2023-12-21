const { verifySignUp } = require("../middleware");
const { getTempatWisata, getTempatWisataById, createTempatWisata, deleteWisata, budgeTempatWisata } = require("../controllers/TempatWisataController.js");
//Endpoint User
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Endpoint untuk Tempat Wisata
  app.get("/tempat-wisata", getTempatWisata);
  app.get("/tempat-wisata/:id/budget", budgeTempatWisata);
  app.get("/tempat-wisata/:id", getTempatWisataById);
  app.post("/tempat-wisata/add-wisata", createTempatWisata);
  app.delete("/tempat-wisata/:id/wisata", deleteWisata);

  // Anda juga bisa menambahkan middleware jika diperlukan, misalnya:
  // app.post("/tempat-wisata", [middleware1, middleware2], createTempatWisata);
  // Jika Anda memiliki endpoint signup, signin, dan signout untuk user,
  // biarkan mereka seperti yang ada di kode asli Anda.
};
