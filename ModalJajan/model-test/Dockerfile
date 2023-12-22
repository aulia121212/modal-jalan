# Gunakan image Python versi 3.10-slim sebagai dasar
FROM python:3.10-slim

# Set environment variable untuk unbuffered output
ENV PYTHONUNBUFFERED True

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin semua file di direktori saat ini ke /app di dalam container
COPY . ./

# Install dependencies yang didefinisikan di requirements.txt
RUN pip install -r requirements.txt

# Tentukan nilai default untuk PORT environment variable
ENV PORT=8080

# Jalankan aplikasi Flask pada host 0.0.0.0 dan port yang diambil dari environment variable PORT
# Jika PORT tidak diset, gunakan 8080 sebagai default
# CMD ["flask run --host=0.0.0.0 "]

CMD flask run --host=0.0.0.0 $PORT
