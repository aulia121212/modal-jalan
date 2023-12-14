package com.example.modaljajan

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import androidx.activity.viewModels
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.viewModelScope
import com.example.modaljajan.data.retrofit.Retrofit
import com.example.modaljajan.databinding.ActivityMainBinding
import com.example.modaljajan.view.welcome.WelcomeActivity
import com.google.android.ads.mediationtestsuite.viewmodels.ViewModelFactory
import kotlinx.coroutines.launch

class MainActivity2 : AppCompatActivity() {
    private val viewModel by viewModels<Main2ViewModel> {
        ViewModelFactory.getInstance(this)
    }
    private lateinit var binding: ActivityMainBinding
    private var token : String? = null
    private val apiService = Retrofit.getRetrofit()


    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel.getSession().observe(this) { user ->
            if (!user.isLogin) {
                startActivity(Intent(this, WelcomeActivity::class.java))
                finish()
            }

        }
        setupView()

        binding.floatingActionButton.setOnClickListener{
            val intent = Intent(this, NewStoryActivity::class.java)
            intent.putExtra("token",token)
            startActivity(intent)
        }

    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.bottom_nav_menu, menu)
        return super.onCreateOptionsMenu(menu)
    }






}


