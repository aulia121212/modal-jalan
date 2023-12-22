import os
import re
import numpy as np
# import pymysql as pymysql
import sqlalchemy
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from nltk.tokenize import word_tokenize
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory



# Setup Flask
app = Flask(__name__)



# Konfigurasi model TensorFlow Lite
model = tf.lite.Interpreter(model_path="model.tflite")
model.allocate_tensors()

def connect_unix_socket() -> sqlalchemy.engine.base.Engine:
    """Initializes a Unix socket connection pool for a Cloud SQL instance of MySQL."""
    # Note: Saving credentials in environment variables is convenient, but not
    # secure - consider a more secure solution such as
    # Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
    # keep secrets safe.
    DB_USER = os.environ["DB_USER"]  # e.g. 'my-database-user'
    DB_PASS = os.environ["DB_PASS"]  # e.g. 'my-database-password'
    DB_NAME = os.environ["DB_NAME"]  # e.g. 'my-database'
    unix_socket_path = os.environ[
        "INSTANCE_UNIX_SOCKET"
    ]  # e.g. '/cloudsql/project:region:instance'

    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # mysql+pymysql://<db_user>:<db_pass>@/<db_name>?unix_socket=<socket_path>/<cloud_sql_instance_name>
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            query={"unix_socket": unix_socket_path},
        ),
        # ...
    )
    return pool

# Setting tidak di pakai
#tespush
# # DB_USER = os.environ["DB_USER"]
# # DB_PASS = os.environ["DB_PASS"]
# # DB_NAME = os.environ["DB_NAME"]
# # CLOUD_SQL_CONNECTION_NAME = os.environ["CLOUD_SQL_CONNECTION_NAME"]

# # Konfigurasi database
# app.config["SQLALCHEMY_DATABASE_URL"] = (
#     f"mysql+pymysql://{DB_USER}:{DB_PASS}@/{DB_NAME}"
#     f"?unix_socket=/cloudsql/{CLOUD_SQL_CONNECTION_NAME}"
# )
app.config['SQLALCHEMY_DATABASE_URI'] = str(connect_unix_socket().url)
db = SQLAlchemy(app)

# Definisi model database
class ReviewWisata(db.Model):
    __tablename__ = 'ReviewWisata'
    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.String, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    tempatWisataId = db.Column(db.Integer, nullable=True)
    review_sentimen = db.Column(db.String, nullable=True)  # Menyimpan hasil sentimen

    def __init__(self, review, rating, tempatWisataId, review_sentimen):
        self.review = review
        self.rating = rating
        self.tempatWisataId = tempatWisataId
        self.review_sentimen = review_sentimen

# Fungsi untuk preprocessing dan mendapatkan sentimen
factory = StemmerFactory()
stemmer = factory.create_stemmer()
word_index = {'lokasi': 1, 'agak': 2, 'jauh': 3, 'banyak': 4, 'pungli': 5}
tokenizer = Tokenizer(num_words=len(word_index) + 1)
tokenizer.word_index = word_index


def text_to_sequence(text, tokenizer):
    sequences = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequences, maxlen=20) # max_len harus sesuai dengan yang di training
    return padded_sequence[0].astype('float32')

    # return padded_sequence
def secondClean(text):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', str(text))
    cleaned = cleaned.replace('\n', ' ')
    cleaned = cleaned.replace('  ', ' ')
    return cleaned

def lowercase(text):
    return text.lower()

def stopwording(text):
    with open('combined2.txt', 'r') as f:
        stop_words = f.read().splitlines()
    word_tokens = word_tokenize(text)
    return [w for w in word_tokens if not w in stop_words]

def lemma(text):
    return [stemmer.stem(word) for word in text]



def get_sentiment(review_text):
    cleaned_text = secondClean(review_text)
    lowered_text = lowercase(cleaned_text)
    stopped_text = stopwording(lowered_text)
    lemma_text = lemma(stopped_text)
    input=text_to_sequence(lemma_text,tokenizer)
    input = np.float32([input])

    # sample_data_sequence = Tokenizer.texts_to_sequences([lemma_text])
    # sample_data_pad = pad_sequences(sample_data_sequence, maxlen=20)
    # input_data = lemma_text

    # # Proses teks dengan model untuk mendapatkan sentimen (ubah sesuai dengan model Anda)
    # input_data = np.float32([lemma_text])
    model.set_tensor(model.get_input_details()[0]['index'], input)
    model.invoke()
    output_data = model.get_tensor(model.get_output_details()[0]['index'])

    # Tentukan threshold dan kembalikan hasil (ubah sesuai dengan model Anda)
    predicted = None
    predicted_class = np.argmax(output_data)
    if predicted_class == 2:
        predicted = "negatif"
    elif predicted_class == 1:
        predicted = "positif"
    else:
        predicted = "netral"
    return predicted

# Endpoint untuk mengirim ulasan
@app.route('/tempat-wisata/<int:tempatWisataId>/submit_review', methods=['POST'])
def submit_review(tempatWisataId):
    print(tempatWisataId)
    if request.method == 'POST':
        review_data = request.get_json()
        print("Received review data:", review_data)  # Ini akan mencetak seluruh data yang diterima
        review = review_data['review']
        rating = review_data['rating']
        print(review)


        review_sentiment = get_sentiment(review)
        print(review_sentiment)
        new_review = ReviewWisata(review=review, rating=rating, tempatWisataId=tempatWisataId, review_sentimen=review_sentiment)
        
        db.session.add(new_review)
        db.session.commit()
        
        response = {
            "status": "Success",
            "review_id": new_review.id,
            "sentiment": review_sentiment
        }
        print(response)

        return jsonify(response), 200

# Jalankan aplikasi
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
