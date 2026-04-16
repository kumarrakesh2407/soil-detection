package com.soil.detection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PlantSuggestion {
    private String plantName;
    private String scientificName;
    private String description;
    private String soilRequirements;
    private List<String> growingSteps;
    private List<String> careInstructions;
    private int growingPeriodDays;
    private String difficulty;
    private double successRate;

    // Constructors
    public PlantSuggestion() {}

    public PlantSuggestion(String plantName, String scientificName, String description, 
                          String soilRequirements, List<String> growingSteps, 
                          List<String> careInstructions, int growingPeriodDays, 
                          String difficulty, double successRate) {
        this.plantName = plantName;
        this.scientificName = scientificName;
        this.description = description;
        this.soilRequirements = soilRequirements;
        this.growingSteps = growingSteps;
        this.careInstructions = careInstructions;
        this.growingPeriodDays = growingPeriodDays;
        this.difficulty = difficulty;
        this.successRate = successRate;
    }

    // Getters and Setters
    public String getPlantName() {
        return plantName;
    }

    public void setPlantName(String plantName) {
        this.plantName = plantName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSoilRequirements() {
        return soilRequirements;
    }

    public void setSoilRequirements(String soilRequirements) {
        this.soilRequirements = soilRequirements;
    }

    public List<String> getGrowingSteps() {
        return growingSteps;
    }

    public void setGrowingSteps(List<String> growingSteps) {
        this.growingSteps = growingSteps;
    }

    public List<String> getCareInstructions() {
        return careInstructions;
    }

    public void setCareInstructions(List<String> careInstructions) {
        this.careInstructions = careInstructions;
    }

    public int getGrowingPeriodDays() {
        return growingPeriodDays;
    }

    public void setGrowingPeriodDays(int growingPeriodDays) {
        this.growingPeriodDays = growingPeriodDays;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }
}
