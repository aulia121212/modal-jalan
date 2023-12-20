package com.example.modaljajan.data.retrofit.response

import com.google.gson.annotations.SerializedName

data class LoginResponse(

    @field:SerializedName("tokenSession")
    val tokenSession: String? = null,

    @field:SerializedName("id")
    val id: Int? = null,

    @field:SerializedName("message")
    val message: String? = null,

    @field:SerializedName("email")
    val email: String? = null,

    @field:SerializedName("username")
    val username: String? = null
)
