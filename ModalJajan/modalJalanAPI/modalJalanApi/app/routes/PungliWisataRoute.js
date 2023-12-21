const { getAllPungli, getPungliById, getPungliByTempatWisataId, addPungliWisata, deletePungli } = require("../controllers/PungliWisataController.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Endpoint untuk Pungli
  app.get("/pungli", getAllPungli);
  app.get("/tempat-wisata/:id/pungli", getPungliById);
  app.get("/tempat-wisata/:tempatWisataId/pungli-wisata", getPungliByTempatWisataId);
  app.post("/tempat-wisata/:tempatWisataId/add-pungli", addPungliWisata);
  app.delete("/tempat-wisata/:id/pungli", deletePungli);
};
