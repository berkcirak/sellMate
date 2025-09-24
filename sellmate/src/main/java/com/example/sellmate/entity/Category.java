package com.example.sellmate.entity;

public enum Category {
    ELECTRONICS("Elektronik"),
    CLOTHING("Giyim"),
    HOME("Ev & Yaşam"),
    SPORTS("Spor"),
    BOOKS("Kitap"),
    VEHICLES("Araç"),
    FURNITURE("Mobilya"),
    APPLIANCES("Beyaz Eşya"),
    BEAUTY("Kozmetik & Kişisel Bakım"),
    TOYS("Oyuncak"),
    PET_SUPPLIES("Evcil Hayvan"),
    GROCERIES("Market"),
    HOBBIES("Hobi"),
    ART("Sanat"),
    MUSIC("Müzik"),
    GARDEN("Bahçe"),
    OFFICE("Ofis & Kırtasiye"),
    JEWELRY("Takı & Aksesuar"),
    SHOES("Ayakkabı"),
    BABY("Anne & Bebek"),
    OTHER("Diğer");

    private final String displayName;

    Category(String displayName){
        this.displayName=displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
