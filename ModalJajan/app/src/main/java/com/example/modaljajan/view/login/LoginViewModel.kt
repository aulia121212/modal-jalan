package com.example.modaljajan.view.login

import androidx.lifecycle.ViewModel
import com.example.modaljajan.data.UserRepository
import com.example.modaljajan.util.LoadingDialog
import com.example.modaljajan.util.SharedPref

class LoginViewModel(private val userRepository: UserRepository) : ViewModel() {

    fun loginUser(
        username: String,
        password: String,
        activity: LoginActivity,
        userPref: SharedPref,
        loadingDialog: LoadingDialog,

        ) =
        userRepository.loginUser(username, password, activity, userPref, loadingDialog)
}