package com.soil.detection.model;

import java.time.LocalDateTime;
import java.util.List;

public class SoilAnalysis {
    private String id;
    private String soilType;
    private String phLevel;
    private String texture;
    private String color;
    private String moistureContent;
    private String nutrientContent;
    private List<PlantSuggestion> recommendedPlants;
    private LocalDateTime analysisDate;
    private String imageUrl;
    private double confidenceScore;

    // Constructors
    public SoilAnalysis() {
        this.analysisDate = LocalDateTime.now();
    }

    public SoilAnalysis(String soilType, String phLevel, String texture, String color, 
                       String moistureContent, String nutrientContent, 
                       List<PlantSuggestion> recommendedPlants, String imageUrl, 
                       double confidenceScore) {
        this();
        this.soilType = soilType;
        this.phLevel = phLevel;
        this.texture = texture;
        this.color = color;
        this.moistureContent = moistureContent;
        this.nutrientContent = nutrientContent;
        this.recommendedPlants = recommendedPlants;
        this.imageUrl = imageUrl;
        this.confidenceScore = confidenceScore;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getPhLevel() {
        return phLevel;
    }

    public void setPhLevel(String phLevel) {
        this.phLevel = phLevel;
    }

    public String getTexture() {
        return texture;
    }

    public void setTexture(String texture) {
        this.texture = texture;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getMoistureContent() {
        return moistureContent;
    }

    public void setMoistureContent(String moistureContent) {
        this.moistureContent = moistureContent;
    }

    public String getNutrientContent() {
        return nutrientContent;
    }

    public void setNutrientContent(String nutrientContent) {
        this.nutrientContent = nutrientContent;
    }

    public List<PlantSuggestion> getRecommendedPlants() {
        return recommendedPlants;
    }

    public void setRecommendedPlants(List<PlantSuggestion> recommendedPlants) {
        this.recommendedPlants = recommendedPlants;
    }

    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }

    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
