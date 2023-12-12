package com.example.modaljajan.ui.direction

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class DirectionViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is direction Fragment"
    }
    val text: LiveData<String> = _text
}