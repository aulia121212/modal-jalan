package com.example.modaljajan.view.signup

import androidx.lifecycle.ViewModel
import com.example.modaljajan.data.UserRepository
import com.example.modaljajan.util.LoadingDialog
import com.example.modaljajan.util.SharedPref

class SignupViewModel(private val userRepository: UserRepository) : ViewModel() {

    fun register(
        username: String,
        email: String,
        password: String,
        activity: SignuppActivity,
        loadingDialog: LoadingDialog,
        userPref: SharedPref,

        ) =
        userRepository.registerUser(username, email, password, activity, loadingDialog, userPref)
}