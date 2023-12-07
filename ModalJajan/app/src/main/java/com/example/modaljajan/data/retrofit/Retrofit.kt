package com.example.modaljajan.data.retrofit

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class Retrofit {
    companion object {
        fun getRetrofit(): ApiService {
            val builder: Retrofit = Retrofit.Builder()
                .baseUrl("https://story-api.dicoding.dev/v1/")
                .addConverterFactory(GsonConverterFactory.create(initGson()))
                .client(getInterceptor())
                .build()
            return builder.create(ApiService::class.java)
        }

        private fun getInterceptor(): OkHttpClient {
            val logging = HttpLoggingInterceptor()
            logging.apply {
                logging.level = HttpLoggingInterceptor.Level.BODY

            }
            return OkHttpClient.Builder()
                .retryOnConnectionFailure(true)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .connectTimeout(10, TimeUnit.SECONDS)
                .addInterceptor(logging)
                .build()
        }

        private fun initGson(): Gson {
            return GsonBuilder().setLenient().create()
        }
    }
}