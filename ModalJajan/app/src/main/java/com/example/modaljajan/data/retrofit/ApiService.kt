package com.example.modaljajan.data.retrofit

import com.dicoding.picodiploma.loginwithanimation.view.addstory.FileUploadResponse
import com.dicoding.picodiploma.loginwithanimation.view.detail.DetailResponse
import com.dicoding.picodiploma.loginwithanimation.view.login.LoginResponse
import com.dicoding.picodiploma.loginwithanimation.view.main.StoryResponse
import com.dicoding.picodiploma.loginwithanimation.view.signup.SignupResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface ApiService {

    @GET("stories/{id}")
    suspend fun obtainStoryDetails(
        @Header("Authorization") token: String,
        @Path("id") storyId: String
    ): DetailResponse


    @GET("stories")
    suspend fun getStories(
        @Header("Authorization") token: String,
    ): StoryResponse

    @FormUrlEncoded
    @POST("register")
    fun register(
        @Field("name") name: String,
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<SignupResponse>


    @FormUrlEncoded
    @POST("login")
    fun login(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<LoginResponse>

}