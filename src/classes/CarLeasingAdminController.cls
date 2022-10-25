public without sharing class CarLeasingAdminController {
    @AuraEnabled
    public static String getPictureUrl(String id) {
        ContentVersion version = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :id LIMIT 1];
        return URL.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + version.Id;
    }

    @AuraEnabled
    public static String saveCarLwc(CarLeasingWrapper carWrapper) {
        String productCode = 'CL' + carWrapper.manufacturer.toUpperCase() + carWrapper.model.toUpperCase();
        String productName = carWrapper.manufacturer + carWrapper.model;

        CarLeasingCarBuilder carBuilder = new CarLeasingCarBuilder();
        carBuilder.setPicture(carWrapper.pictureUrl);
        carBuilder.setProductCode(productCode);
        carBuilder.setProductName(productName);
        carBuilder.setManufacturer(carWrapper.manufacturer);
        carBuilder.setModel(carWrapper.model);
        carBuilder.setHorsepower(carWrapper.horsepower);
        carBuilder.setProductionYear(carWrapper.productionYear);
        carBuilder.setGearbox(carWrapper.gearbox);
        carBuilder.setEngineType(carWrapper.engineType);
        carBuilder.setBodyType(carWrapper.bodyType);
        carBuilder.setReviewUrl(carWrapper.review);
        carBuilder.setNumberOfSeats(carWrapper.numberOfSeats);
        carBuilder.setAcceleration(carWrapper.acceleration);
        carBuilder.setAverageFuelConsumption(carWrapper.averageFuelConsumption);
        carBuilder.setEngineCapacity(carWrapper.engineCapacity);
        carBuilder.setHeight(carWrapper.carHeight);
        carBuilder.setWidth(carWrapper.carWidth);
        carBuilder.setLength(carWrapper.carLength);
        carBuilder.setTheSizeOfTheWheels(carWrapper.theSizeOfTheWheels);

        Product2 car = carBuilder.getCar();
        System.debug(car);
        try {
            insert car;
        } catch (Exception e) {
            System.debug(e);
        }

        PriceBook2 pb2Standard = [
                SELECT Id
                FROM Pricebook2
                WHERE isStandard = true
        ];

        PricebookEntry priceBookEntry = new PricebookEntry(
                Pricebook2Id = pb2Standard.Id,
                Product2Id = car.Id,
                UnitPrice = carWrapper.price,
                IsActive = true);
        Insert priceBookEntry;

        return car.Id;
    }

    public class PickListDetails {
        @AuraEnabled
        public string label { get; set; }
        @AuraEnabled
        public string value { get; set; }
    }

    @AuraEnabled
    public static List<ContentVersion> updateContentVersion(String productId, List<String> contentDocumentIds) {
        List<ContentVersion> contentVersions = [
                SELECT Id, Product__c
                FROM ContentVersion
                WHERE ContentDocumentId IN : contentDocumentIds
        ];
        for (ContentVersion contentVersion : contentVersions) {
            contentVersion.Product__c = productId;
        }
        update contentVersions;
        return contentVersions;
    }
}