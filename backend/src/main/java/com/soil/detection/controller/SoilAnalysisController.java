package com.soil.detection.controller;

import com.soil.detection.model.SoilAnalysis;
import com.soil.detection.service.SoilAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/soil-analysis")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:5500"})
public class SoilAnalysisController {

    @Autowired
    private SoilAnalysisService soilAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeSoil(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Validate file
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Image file is required"));
            }

            // Validate file type
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(createErrorResponse("Invalid file type. Please upload an image"));
            }

            // Validate file size (max 10MB)
            if (imageFile.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(createErrorResponse("File size too large. Maximum size is 10MB"));
            }

            // Analyze the soil image
            SoilAnalysis analysis = soilAnalysisService.analyzeSoilImage(imageFile);

            return ResponseEntity.ok(analysis);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Error processing image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Error analyzing soil: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "Soil Analysis API");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getServiceInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("serviceName", "Soil Detection and Analysis Service");
        response.put("version", "1.0.0");
        response.put("description", "AI-powered soil analysis and plant recommendation service");
        response.put("supportedFormats", new String[]{"JPEG", "PNG", "JPG"});
        response.put("maxFileSize", "10MB");
        response.put("features", new String[]{
            "Soil type identification",
            "pH level estimation",
            "Nutrient content analysis",
            "Plant recommendations",
            "Growing instructions"
        });
        return ResponseEntity.ok(response);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("timestamp", java.time.LocalDateTime.now().toString());
        return error;
    }
}
