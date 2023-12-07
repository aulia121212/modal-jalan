package com.example.modaljajan.view.signup

import com.google.gson.annotations.SerializedName

data class Signup(

    @field:SerializedName("name")
    val name: String,

    @field:SerializedName("email")
    val email: String,

    @field:SerializedName("password")
    val password: String,
)
