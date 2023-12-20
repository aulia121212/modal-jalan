package com.example.modaljajan.util

import android.content.Context
import android.util.Log
import android.widget.Toast
import org.json.JSONException
import org.json.JSONObject

fun errorJson(msg : String?, activity : Context) {
    // Check if the errorBody is not null and is a valid JSON
    if (msg != null) {
        try {
            val errorJson = JSONObject(msg)
            val errorMessage = errorJson.getString("message")
            Toast.makeText(activity, errorMessage, Toast.LENGTH_SHORT).show()
        } catch (e: JSONException) {
            // Handle JSON parsing exception
            Toast.makeText(activity, "Error parsing JSON", Toast.LENGTH_SHORT)
                .show()
            Log.e("REfefee", "Error parsing JSON", e)
        }
    } else {
        // Handle the case where errorBody is null
        Toast.makeText(activity, "Unknown error", Toast.LENGTH_SHORT).show()
    }

    Log.d("REfefee", msg.toString())
}

fun showToast(msg : String?, ctx: Context){
    Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show()
}