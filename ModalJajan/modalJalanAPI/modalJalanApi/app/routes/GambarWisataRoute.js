// const upload = require("../config/multerConfig");
const { getGambarByTempatWisataId, uploadGambarTempatWisata } = require("../controllers/GambarWisataController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // endpoint gambar
  app.get("/tempat-wisata/:tempatWisataId/gambar", getGambarByTempatWisataId);
  //   app.post("/tempat-wisata/:tempatWisataId/add-gambar", upload.single("nama_gambar"), uploadGambarTempatWisata);
};
