const db = require("../models");
const ReviewWisata = db.ReviewWisata;
const TempatWisata = db.TempatWisata;
const Users = db.Users;
const { authJwt } = require("../middleware");

// Fungsi mendapatkan semua data review

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewWisata.findAll();
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Error saat mengambil semua review", error: error.message });
  }
};

// Fungsi mendapatkan semua data pungli by TempatwisataId
exports.getReviewsByTempatWisataId = async (req, res) => {
  try {
    const { tempatWisataId } = req.params;
    const reviews = await ReviewWisata.findAll({
      where: { tempatWisataId: tempatWisataId },
      include: [
        {
          model: Users,
          as: "Users",
          attributes: ["username", "email"],
        },
        {
          model: TempatWisata,
          as: "tempatWisata",
          attributes: ["nama"],
        },
      ],
      attributes: ["id", "review", "rating", "tempatWisataId"],
    });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    const responseData = reviews.map((review) => ({
      id: review.id,
      review: review.review,
      rating: review.rating,
      TempatWisataid: review.TempatWisataid,
      user: {
        username: review.Users ? review.Users.username : "Tidak Diketahui",
        email: review.Users ? review.Users.email : "Tidak Diketahui",
      },
      tempatWisata: review.TempatWisata ? review.TempatWisata.nama : "Tidak Diketahui", // Tambahkan ini
    }));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengambil review", error: error.message });
  }
};

// Menambahkan  review
exports.addReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { tempatWisataId } = req.params;
    const { review, rating } = req.body;
    // Membuat review baru dengan tempatWisataId dan userId
    const newReview = await ReviewWisata.create({
      tempatWisataId,
      userId,
      review,
      rating,
    });

    await TempatWisata.update({ review_id: newReview.id }, { where: { id: tempatWisataId } });
    return res.status(201).json(newReview);
  } catch (error) {
    console.error("Error saat menambahkan review:", error);
    return res.status(500).json({ message: "Error saat menambahkan review", error: error.message });
  }
};

// Menghapus review
exports.deleteReview = async (req, res) => {
  try {
    const review = await ReviewWisata.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }
    await TempatWisata.update(
      { review_id: null },
      {
        where: { review_id: req.params.id },
      }
    );
    await review.destroy();
    return res.status(200).json({ message: "Review berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Error saat menghapus review", error: error.message });
  }
};
