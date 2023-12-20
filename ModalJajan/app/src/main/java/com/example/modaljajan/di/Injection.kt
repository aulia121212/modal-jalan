package com.example.modaljajan.di

import android.content.Context
import com.example.modaljajan.data.UserRepository
import com.example.modaljajan.data.pref.UserPreference
import com.example.modaljajan.data.pref.dataStore
import com.example.modaljajan.data.retrofit.ApiConfig


object Injection {
    fun provideRepository(): UserRepository {
        val apiService = ApiConfig.getApiServices()
        return UserRepository.getInstance(apiService)
    }
}