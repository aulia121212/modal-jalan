package com.example.modaljajan.data

import android.app.Activity
import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.example.modaljajan.MainActivity
import com.example.modaljajan.data.retrofit.ApiService
import com.example.modaljajan.data.retrofit.response.LoginResponse
import com.example.modaljajan.data.retrofit.response.RegisterResponse
import com.example.modaljajan.util.LoadingDialog
import com.example.modaljajan.util.SharedPref
import com.example.modaljajan.util.errorJson
import com.example.modaljajan.util.showToast
import com.example.modaljajan.view.login.LoginActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UserRepository(private val apiService: ApiService) {

    fun registerUser(
        username: String,
        email: String,
        password: String,
        activity: Activity,
        loadingDialog: LoadingDialog,
        userPref: SharedPref
    ) {
        val client = apiService.register( username, email, password)
        client.enqueue(object : Callback<RegisterResponse> {
            override fun onResponse(
                call: Call<RegisterResponse>,
                response: Response<RegisterResponse>
            ) {
                if (response.isSuccessful) {
                    loadingDialog.dismiss()
                    val responseBody = response.body()
                    if (responseBody != null) {
                        showToast(responseBody.message, activity)
                        activity.finish()
                    }
                    Log.d("REfefee1", responseBody.toString())
                } else {
                    loadingDialog.dismiss()
                    val errorBody = response.errorBody()?.string()
                    errorJson(errorBody, activity)
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                loadingDialog.dismiss()
                Toast.makeText(activity, t.toString(), Toast.LENGTH_SHORT).show()
                Log.d("REfefee", t.toString())
            }


        })
    }


    fun loginUser(
        username: String,
        password: String,
        activity: LoginActivity,
        userPref: SharedPref,
        loadingDialog: LoadingDialog,
    ) {
        val client = apiService.login(username, password)
        client.enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    loadingDialog.dismiss()
                    val responseBody = response.body()
                    if (responseBody != null) {
                        userPref.setToken(responseBody)
                        val intent = Intent(activity, MainActivity::class.java)
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                        activity.finish()
                        activity.startActivity(intent)
                        showToast(responseBody.message, activity)
                    }
                } else {
                    loadingDialog.dismiss()
                    val errorBody = response.errorBody()?.string()

                    errorJson(errorBody, activity)
                }

            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                loadingDialog.dismiss()
                Toast.makeText(activity, t.toString(), Toast.LENGTH_SHORT).show()
            }

        })
    }


    companion object {
        @Volatile
        private var instance: UserRepository? = null
        fun getInstance(
            apiService: ApiService
        ): UserRepository =
            instance ?: synchronized(this) {
                instance ?: UserRepository(apiService)
            }.also { instance = it }
    }
}