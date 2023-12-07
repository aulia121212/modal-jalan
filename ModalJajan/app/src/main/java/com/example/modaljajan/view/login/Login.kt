package com.example.modaljajan.view.login

import com.google.gson.annotations.SerializedName

data class Login(
    @SerializedName("email")
    var email: String,
    @SerializedName("password")
    var password: String
)
