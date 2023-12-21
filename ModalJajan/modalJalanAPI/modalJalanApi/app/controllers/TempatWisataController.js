const Sequelize = require("sequelize");
const db = require("../models"); // Mengimpor db yang memiliki semua model
const TempatWisata = db.TempatWisata;
const PungliWisata = db.PungliWisata;
const ReviewWisata = db.ReviewWisata;

// Mengambil semua data TempatWisata
exports.getTempatWisata = async (req, res) => {
  try {
    const response = await TempatWisata.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data Tempat Wisata", error: error.message });
  }
};

// Mengambil  data TempatWisata byId
exports.getTempatWisataById = async (req, res) => {
  try {
    const tempatWisata = await TempatWisata.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ReviewWisata,
          as: "reviews",
          attributes: ["rating"],
        },
      ],
      attributes: ["id", "nama", "alamat", "deskripsi"],
    });

    if (!tempatWisata) {
      return res.status(404).json({ message: "Tempat Wisata tidak ditemukan" });
    }
    // mendapatkan rata-rata rating
    let avgRating = "Tidak tersedia";
    const ratingWisata = tempatWisata.reviews ? tempatWisata.reviews.map((r) => r.rating) : [];
    if (ratingWisata.length > 0) {
      const totalRating = ratingWisata.reduce((total, rating) => total + rating, 0);
      avgRating = (totalRating / ratingWisata.length).toFixed(2);
    }

    const responseData = {
      ...tempatWisata.get({ plain: true }),
      ratingRataRata: avgRating,
    };
    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data Tempat Wisata", error: error.message });
  }
};

// Menambahkan data tempatWisata
exports.createTempatWisata = async (req, res) => {
  try {
    const { nama, alamat, deskripsi, makan, tiket_parkir, tiket_masuk } = req.body;
    const tempatWisataBaru = await TempatWisata.create({
      nama,
      alamat,
      deskripsi,
      makan,
      tiket_parkir,
      tiket_masuk,
    });
    res.status(201).json({
      message: "Tempat Wisata berhasil disimpan",
      data: tempatWisataBaru,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan data Tempat Wisata",
      error: error.message,
    });
  }
};

//Menampilkan Data budget tempatWisata
exports.budgeTempatWisata = async (req, res) => {
  try {
    const tempatWisata = await TempatWisata.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: PungliWisata,
          as: "pungli",
          attributes: ["biaya"],
        },
      ],
      attributes: ["id", "tiket_masuk", "makan", "tiket_parkir"],
    });

    if (!tempatWisata) {
      return res.status(404).json({ message: "Tempat Wisata tidak ditemukan" });
    }

    // Mendapatkan range biaya pungli
    let biayaRange = "Tidak tersedia";
    const pungliBiaya = tempatWisata.pungli ? tempatWisata.pungli.map((p) => p.biaya) : [];
    if (pungliBiaya.length > 0) {
      const biayaMin = Math.min(...pungliBiaya);
      const biayaMax = Math.max(...pungliBiaya);
      biayaRange = `${biayaMin} - ${biayaMax}`;
    }

    const responseData = {
      ...tempatWisata.get({ plain: true }),
      pungli_biaya_range: biayaRange,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data Tempat Wisata", error: error.message });
  }
};

// Menghapus data tempatwisata
exports.deleteWisata = async (req, res) => {
  try {
    const jumlahTerhapus = await TempatWisata.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (jumlahTerhapus === 0) return res.status(404).json({ message: "Tempat Wisata tidak ditemukan" });
    res.status(200).json({ message: "Tempat Wisata berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus data Tempat Wisata",
      error: error.message,
    });
  }
};
