//Konten Publik
exports.publicAccess = (req, res) => {
  res.status(200).send("Konten Publik");
};

// Konten user sudah login
exports.userAccess = (req, res) => {
  res.status(200).send("Konten untuk User");
};
