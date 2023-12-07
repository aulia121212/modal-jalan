package com.example.modaljajan.view.signup

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.ContentValues
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import com.example.modaljajan.data.retrofit.Retrofit
import com.example.modaljajan.databinding.ActivitySignupBinding
import com.example.modaljajan.view.login.LoginnActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SignuppActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val name = binding.nameEditText
        val email = binding.emailEditText
        val password = binding.passwordEditText
        val signupButton = binding.signupButton

        playAnimation()
        setupView()
        binding.passwordEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
            }
            override fun afterTextChanged(s: Editable) {}
        })
        signupButton.setOnClickListener{
            binding.progressbar.visibility = View.VISIBLE
            registerAccount(name.text.toString(), email.text.toString(), password.text.toString())
        }

    }
    private fun registerAccount(name: String, email: String, password: String){
        val client = Retrofit.getRetrofit().register(name, email, password)
        client.enqueue(object : Callback<SignupResponse> {
            override fun onResponse(
                call: Call<SignupResponse>,
                response: Response<SignupResponse>
            ) {
                if (response.isSuccessful){
                    android.app.AlertDialog.Builder(this@SignuppActivity).apply {
                        binding.progressbar.visibility = View.GONE
                        setTitle("Yeah!")
                        setMessage("Anda berhasil login. Sudah tidak sabar untuk belajar ya?")
                        setPositiveButton("Lanjut") { _, _ ->
                            val intent = Intent(context, LoginnActivity::class.java)
                            intent.flags =
                                Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                            startActivity(intent)
                            finish()
                        }
                        create()
                        show()
                    }
                }else{
                    android.app.AlertDialog.Builder(this@SignuppActivity).apply {
                        binding.progressbar.visibility = View.GONE
                        setTitle("Upss!")
                        setMessage("Sayangnya Email sudah terdaftar")
                        setPositiveButton("Isi kembali") { _, _ ->
                            val intent = Intent(context, SignuppActivity::class.java)
                            intent.flags =
                                Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                            startActivity(intent)
                            finish()
                        }
                        create()
                        show()
                    }
                }
            }
            override fun onFailure(call: Call<SignupResponse>, t: Throwable) {
                Log.e(ContentValues.TAG, "onFailure: ${t.message}")
            }

        })
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
