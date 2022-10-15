public with sharing class CarLeasingCarBuilder {
    private final Product2 car;

    public CarLeasingCarBuilder() {
        car = new Product2();
    }

    public CarLeasingCarBuilder setPicture(String imageUrl) {
        car.Picture__c = imageUrl;
        return this;
    }

    public CarLeasingCarBuilder setReviewUrl(String review) {
        car.ReviewLink__c = review;
        return this;
    }


    public CarLeasingCarBuilder setProductCode(String productCode) {
        car.ProductCode = productCode;
        return this;
    }

    public CarLeasingCarBuilder setProductName(String productName) {
        car.Name = productName;
        return this;
    }
    
    public CarLeasingCarBuilder setManufacturer(String manufacturer) {
        car.Manufacturer__c = manufacturer;
        return this;
    }

    public CarLeasingCarBuilder setModel(String model) {
        car.Model__c = model;
        return this;
    }

    public CarLeasingCarBuilder setHorsepower(Integer horsepower) {
        car.Horsepower__c = horsepower;
        return this;
    }

    public CarLeasingCarBuilder setProductionYear(Date productionYear) {
        car.Year_of_production__c = productionYear;
        return this;
    }

    public CarLeasingCarBuilder setGearbox(String gearbox) {
        car.Gearbox__c = gearbox;
        return this;
    }

    public CarLeasingCarBuilder setEngineType(String engineType) {
        car.Engine_Type__c = engineType;
        return this;
    }

    public CarLeasingCarBuilder setBodyType(String bodyType) {
        car.Body_Type__c = bodyType;
        return this;
    }


    public Product2 getCar() {
        return car;
    }
}