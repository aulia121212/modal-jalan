package com.example.modaljajan.util

import android.content.Context
import com.example.modaljajan.data.retrofit.response.LoginResponse

class SharedPref(private val context: Context) {
    private val preferences = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)

    companion object {
        const val TOKEN_KEY = "token"
        const val USERNAME = "USERNAME"
        const val EMAIL = "EMAIL"
    }

    fun setToken(value: LoginResponse) {
        val editor = preferences.edit()
        editor.putString(TOKEN_KEY, value.tokenSession)
        editor.putString(USERNAME, value.username)
        editor.apply()
    }



    fun removeToken() {
        val editor = preferences.edit()
        editor.remove(TOKEN_KEY)
        editor.remove(USERNAME)
        editor.apply()
    }

}