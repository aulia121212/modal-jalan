package com.example.modaljajan.data.retrofit


import com.example.modaljajan.data.retrofit.response.LoginResponse
import com.example.modaljajan.data.retrofit.response.RegisterResponse
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface ApiService {

    @FormUrlEncoded
    @POST("signup")
    fun register(
        @Field("username") name: String,
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<RegisterResponse>


    @FormUrlEncoded
    @POST("signin")
    fun login(
        @Field("username") email: String,
        @Field("password") password: String
    ): Call<LoginResponse>

}