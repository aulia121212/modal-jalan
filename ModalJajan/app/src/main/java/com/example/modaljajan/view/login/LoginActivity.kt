package com.example.modaljajan.view.login

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.activity.viewModels
import com.example.modaljajan.ViewModelFactory
import com.example.modaljajan.databinding.ActivityLoginBinding
import com.example.modaljajan.util.LoadingDialog
import com.example.modaljajan.util.SharedPref
import com.example.modaljajan.view.signup.SignuppActivity

class LoginActivity : AppCompatActivity() {
    private var _binding: ActivityLoginBinding? = null
    private val binding get() = _binding
    private val factory: ViewModelFactory = ViewModelFactory.getInstance(this@LoginActivity)
    private val viewModel : LoginViewModel by viewModels {
        factory
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        _binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding?.root)

        val userPref = SharedPref(this)
        val loadingDialog = LoadingDialog(this@LoginActivity)


        binding?.apply {
            btnLogin.setOnClickListener{
                loadingDialog.startLoadingDialog()
                val username = edtUsername.text
                val password = edtPassword.text
                viewModel.loginUser(username.toString(), password.toString(), this@LoginActivity, userPref, loadingDialog)
            }

            btnSignup.setOnClickListener{
                val intent = Intent(this@LoginActivity, SignuppActivity::class.java)
                startActivity(intent)
            }
        }


    }
}