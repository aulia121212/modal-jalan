package com.example.modaljajan.ui.direction

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.modaljajan.R
import com.example.modaljajan.databinding.FragmentDirectionBinding

class DirectionFragment : Fragment() {

    private var _binding: FragmentDirectionBinding? = null
    private val binding get() = _binding!!


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        var directionViewModel = ViewModelProvider(this).get(DirectionViewModel::class.java)

        _binding = FragmentDirectionBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Initialize the ViewModel
        directionViewModel = ViewModelProvider(this).get(DirectionViewModel::class.java)

        // Observe the text LiveData and update the UI when it changes
        directionViewModel.text.observe(viewLifecycleOwner, Observer {
            // Update UI components using the observed data
            binding.yourlocation.text = it
        })

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        // Set the binding object to null when the view is destroyed
        _binding = null
    }
}
