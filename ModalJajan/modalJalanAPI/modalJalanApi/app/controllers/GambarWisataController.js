const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const db = require("../models"); // Mengimpor db yang memiliki semua model
const GambarTempatWisata = db.GambarTempatWisata;
const TempatWisata = db.TempatWisata;

// const storage = new Storage({
//   projectId: process.env.GCLOUD_PROJECT,
//   credentials: {
//     client_email: process.env.GCLOUD_CLIENT_EMAIL,
//     private_key: process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   },
// });
// const bucket = storage.bucket("wisatafoto");

// Fungsi Upload Gambar
exports.uploadGambarTempatWisata = async (req, res) => {
  try {
    // req.file adalah file gambar yang diupload
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid file type." });
    }

    const tempatWisataId = req.params.tempatWisataId;

    // Membuat blob di bucket GCS
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.error(err);
      return res.status(500).send({ message: "Could not upload the file: " + req.file.originalname });
    });

    blobStream.on("finish", async () => {
      // URL publik
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      // simpan gambar
      const gambar = await GambarTempatWisata.create({
        tempatWisataId,
        nama_gambar: publicUrl,
      });
      await TempatWisata.update(
        { gambar_id: gambar.id },
        {
          where: { id: tempatWisataId },
        }
      );

      res.status(200).send({ message: "File uploaded successfully.", gambar });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Upload Image Error:", error);
    res.status(500).send({ message: "Terjadi kesalahan saat upload gambar", error: error.message });
  }
};

// Fungsi mendapatkan Gambar

exports.getGambarByTempatWisataId = async (req, res) => {
  try {
    const tempatWisataId = req.params.tempatWisataId;

    const gambarList = await GambarTempatWisata.findAll({
      where: { tempatWisataId: tempatWisataId },
      attributes: ["id", "nama_gambar"],
    });

    if (!gambarList || gambarList.length === 0) {
      return res.status(404).json({ message: "Gambar tidak ditemukan untuk Tempat Wisata ini." });
    }

    // Kirim daftar gambar sebagai respons
    res.status(200).json(gambarList);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil gambar", error: error.message });
  }
};
