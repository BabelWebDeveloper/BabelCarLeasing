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

    public CarLeasingCarBuilder setNumberOfSeats (Integer numberOfSeats) {
        car.Number_of_seats__c = numberOfSeats;
        return this;
    }
    public CarLeasingCarBuilder setAcceleration (Double acceleration) {
        car.Acceleration__c = acceleration;
        return this;
    }
    public CarLeasingCarBuilder setAverageFuelConsumption (Double averageFuelConsumption) {
        car.Average_fuel_consumption__c = averageFuelConsumption;
        return this;
    }
    public CarLeasingCarBuilder setEngineCapacity (Double engineCapacity) {
        car.Engine_capacity__c = engineCapacity;
        return this;
    }
    public CarLeasingCarBuilder setHeight (Integer height) {
        car.Height__c = height;
        return this;
    }
    public CarLeasingCarBuilder setWidth (Integer width) {
        car.Width__c = width;
        return this;
    }
    public CarLeasingCarBuilder setLength (Integer length) {
        car.Length__c = length;
        return this;
    }
    public CarLeasingCarBuilder setTheSizeOfTheWheels (Integer theSizeOfTheWheels) {
        car.The_size_of_the_wheels__c = theSizeOfTheWheels;
        return this;
    }

    public Product2 getCar() {
        return car;
    }
}