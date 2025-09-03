package com.example.sellmate.entity;

public enum Category {
    ELECTRONICS("Elektronik"),
    CLOTHING("Giyim");


    private final String displayName;

    Category(String displayName){
        this.displayName=displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
