const { authJwt } = require("../middleware");
const { getAllReviews, getReviewsByTempatWisataId, addReview, deleteReview } = require("../controllers/ReviewController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Endpoint untuk Review Wisata
  app.get("/review", getAllReviews);
  app.get("/tempat-wisata/:tempatWisataId/review", getReviewsByTempatWisataId);
  app.post("/tempat-wisata/:tempatWisataId/add-review", [authJwt.verifyToken], addReview);
  app.delete("/tempat-wisata/:id/review", deleteReview);
};
