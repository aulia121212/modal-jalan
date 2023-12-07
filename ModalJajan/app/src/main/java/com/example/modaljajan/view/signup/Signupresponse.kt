package com.example.modaljajan.view.signup

import com.google.gson.annotations.SerializedName

data class SignupResponse(
    @field:SerializedName("error")
    val error: Boolean,

    @field:SerializedName("message")
    val message: String,

    @field:SerializedName("signup")
    val signup: Signup,

    @field:SerializedName("email")
    val email: Email,
)
