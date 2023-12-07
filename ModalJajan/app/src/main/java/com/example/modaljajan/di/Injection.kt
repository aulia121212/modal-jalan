package com.example.modaljajan.di

import android.content.Context
import com.dicoding.picodiploma.loginwithanimation.data.UserRepository
import com.dicoding.picodiploma.loginwithanimation.data.pref.UserPreference
import com.dicoding.picodiploma.loginwithanimation.data.pref.dataStore
import com.dicoding.picodiploma.loginwithanimation.data.retrofit.Retrofit
import com.dicoding.picodiploma.loginwithanimation.view.main.StoryRepository

object Injection {
    fun provideRepository(context: Context): UserRepository {
        val pref = UserPreference.getInstance(context.dataStore)
        return UserRepository.getInstance(pref)
    }
    fun provideStoryRepository(): StoryRepository {
        val apiService = Retrofit.getRetrofit()
        return StoryRepository.getInstance(apiService)
    }
}