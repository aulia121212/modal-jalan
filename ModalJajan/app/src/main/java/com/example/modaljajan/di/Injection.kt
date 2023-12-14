package com.example.modaljajan.di

import android.content.Context
import com.example.modaljajan.data.UserRepository
import com.example.modaljajan.data.pref.UserPreference
import com.example.modaljajan.data.pref.dataStore


object Injection {
    fun provideRepository(context: Context): UserRepository {
        val pref = UserPreference.getInstance(context.dataStore)
        return UserRepository.getInstance(pref)
    }

}