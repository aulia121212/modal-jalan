import os
import re
import numpy as np
# import pymysql as pymysql
import sqlalchemy
import json
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
model = tf.keras.models.load_model('modaljalan4.h5')

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
def secondClean(text):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', str(text))
    cleaned = cleaned.replace('\n', ' ')
    cleaned = cleaned.replace ('  ', ' ')
    return cleaned
def lowercase(text):
    lowered = text.lower()
    return lowered
def stopwording(text):
    with open('combined2.txt', 'r') as f:
        stop_words = f.read().splitlines()
    word_tokens = word_tokenize(text)
    filtered_sentence = [w for w in word_tokens if not w in stop_words]
    return filtered_sentence
def lemma(text):
    return [stemmer.stem(word) for word in text]

factory = StemmerFactory()
stemmer = factory.create_stemmer()
tokenizer = Tokenizer()
#melatih tokenizer
file_path = 'Out_93.json'
with open(file_path, 'r') as file:
    data = json.load(file)
texts = [item['cleaned'] for item in data]
texts = [text for sublist in texts for text in sublist]
tokenizer.fit_on_texts(texts)

def get_sentiment(sample_data):
    sample_data = secondClean(sample_data)
    sample_data = lowercase(sample_data)
    sample_data = stopwording(sample_data)
    sample_data_sequence = tokenizer.texts_to_sequences([sample_data])
    sample_data_pad = pad_sequences(sample_data_sequence, maxlen=20)
    prediction = model.predict(sample_data_pad)
    predicted_class = np.argmax(prediction)
    final_prediction = None
    if predicted_class == 0:
        final_prediction = "netral"
    elif predicted_class == 1:
        final_prediction = "positif"
    else:
        final_prediction = "negatif"
    return final_prediction

# Endpoint untuk mengirim ulasan
@app.route('/tempat-wisata/<int:tempatWisataId>/submit_review', methods=['POST'])
def submit_review(tempatWisataId):
    print(tempatWisataId)
    if request.method == 'POST':
        review_data = request.get_json()
        print("Received review data:", review_data) 
        review = review_data['review']
        rating = review_data['rating']
        review_sentiment = get_sentiment(review)
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
