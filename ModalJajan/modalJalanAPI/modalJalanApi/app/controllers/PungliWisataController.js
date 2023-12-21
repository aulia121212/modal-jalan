const { response } = require("express");
const db = require("../models");
const TempatWisata = db.TempatWisata;
const PungliWisata = db.PungliWisata;

// Fungsi mendapatkan semua data pungli
exports.getAllPungli = async (req, res) => {
  try {
    const response = await PungliWisata.findAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Fungsi mendapatkan semua data pungli by Id
exports.getPungliById = async (req, res) => {
  try {
    const { id } = req.params;
    const pungliWisata = await PungliWisata.findByPk(id);

    if (!pungliWisata) {
      return res.status(404).json({ message: "Data Pungli Wisata tidak ditemukan" });
    }

    return res.status(200).json(pungliWisata);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Fungsi mendapatkan semua data pungli by TempatWisataId
exports.getPungliByTempatWisataId = async (req, res) => {
  try {
    const { tempatWisataId } = req.params;

    const pungliList = await PungliWisata.findAll({
      where: { tempatWisataId: tempatWisataId },
      include: [
        {
          model: TempatWisata,
          as: "tempatWisata",
          attributes: ["nama", "makan", "tiket_parkir", "tiket_masuk"],
        },
      ],
      attributes: ["id", "biaya", "tempatWisataId"],
    });

    if (!pungliList || pungliList.length === 0) {
      return res.status(404).json({ message: "Pungli tidak ditemukan untuk Tempat Wisata ini." });
    }

    // Menghitung total dan rata-rata biaya pungli
    const nilaiTerkecil = pungliList.reduce((min, pungli) => (pungli.biaya < min ? pungli.biaya : min), pungliList[0].biaya);
    const nilaiTerbesar = pungliList.reduce((max, pungli) => (pungli.biaya > max ? pungli.biaya : max), pungliList[0].biaya);
    const rangeBiaya = `${nilaiTerkecil} - ${nilaiTerbesar}`;

    const responsePungli = pungliList.map((pungli) => ({
      id: pungli.id,
      biaya: pungli.biaya,
      tempatWisataId: pungli.tempatWisataId,
      tempatWisata: pungli.TempatWisata ? pungli.TempatWisata.nama : "Tidak Diketahui",
    }));

    const finalResponse = {
      detailPungli: responsePungli,
      PungliBiaya: rangeBiaya,
    };

    res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data Pungli", error: error.message });
  }
};

// Menambah data Pungli

exports.addPungliWisata = async (req, res) => {
  try {
    const { tempatWisataId } = req.params;

    const tempatWisata = await TempatWisata.findByPk(tempatWisataId);
    if (!tempatWisata) {
      return res.status(404).json({ message: "Tempat Wisata tidak ditemukan" });
    }

    // Membuat PungliWisata baru dengan tempatWisataId
    const pungliWisata = await PungliWisata.create({
      ...req.body,
      tempatWisataId: tempatWisataId, // Mengisi field tempatWisataId
    });

    await tempatWisata.update({ pungli_id: pungliWisata.id });

    return res.status(201).json(pungliWisata);
  } catch (error) {
    return res.status(400).json(error);
  }
};
// menghapus data pungli
exports.deletePungli = async (req, res) => {
  try {
    const { id } = req.params;
    const pungliWisata = await PungliWisata.findByPk(id);

    if (!pungliWisata) {
      return res.status(404).json({ message: "Pungli Wisata tidak ditemukan" });
    }

    // Menghapus TempatWisata
    await TempatWisata.update(
      { pungli_id: null },
      {
        where: { pungli_id: id },
      }
    );

    // Menghapus PungliWisata
    await pungliWisata.destroy();

    return res.status(200).json({ message: "Pungli Wisata berhasil dihapus" });
  } catch (error) {
    return res.status(400).json(error);
  }
};
