package com.example.modaljajan.view.signup

import android.os.Build
import android.os.Bundle
import android.view.WindowInsets
import android.view.WindowManager
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.modaljajan.ViewModelFactory
import com.example.modaljajan.databinding.ActivitySignupBinding
import com.example.modaljajan.util.LoadingDialog
import com.example.modaljajan.util.SharedPref
import com.example.modaljajan.util.showToast

class SignuppActivity : AppCompatActivity() {
    private  var _binding: ActivitySignupBinding? = null
    private val binding get() = _binding
    private val factory: ViewModelFactory = ViewModelFactory.getInstance(this@SignuppActivity)
    private val viewModel : SignupViewModel by viewModels {
        factory
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding?.root)

        val userPref = SharedPref(this)
        val loadingDialog = LoadingDialog(this@SignuppActivity)




        binding?.apply {
            val username = edtUsername.text
            val email = edtEmail.text
            val phone = edtPhoneNumber.text
            val password = edtPassword.text
            val confirmPassword = edtConfirmPassword.text
            val signupButton = btnSignup

            btnSignup.setOnClickListener{
                loadingDialog.startLoadingDialog()
                if(password != confirmPassword) {
                    viewModel.register(username.toString(), email.toString(), password.toString(), this@SignuppActivity, loadingDialog, userPref)
                } else {
                    loadingDialog.dismiss()
                    showToast("Password tidak sama", this@SignuppActivity)
                }
            }


        }


    }
    private fun setupView() {
        @Suppress("DEPRECATION")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.hide(WindowInsets.Type.statusBars())
        } else {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
            )
        }
        supportActionBar?.hide()
    }

}
