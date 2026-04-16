package com.soil.detection.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to API";
    }

    @GetMapping("/error")
    public String error() {
        return "Welcome to API";
    }
}
