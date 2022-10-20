public without sharing class CarLeasingAdminController {
    @AuraEnabled
    public static String getPictureUrl(String id) {
        ContentVersion version = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :id LIMIT 1];
        return URL.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + version.Id;
    }

    @AuraEnabled
    public static void saveCar(
            String imageUrl,
            String productCode,
            String productName,
            String manufacturer,
            String model,
            Integer horsepower,
            Date productionYear,
            String gearbox,
            String engineType,
            String bodyType,
            Double price,
            String review) {

        CarLeasingCarBuilder carBuilder = new CarLeasingCarBuilder();
        carBuilder.setPicture(imageUrl);
        carBuilder.setProductCode(productCode);
        carBuilder.setProductName(productName);
        carBuilder.setManufacturer(manufacturer);
        carBuilder.setModel(model);
        carBuilder.setHorsepower(horsepower);
        carBuilder.setProductionYear(productionYear);
        carBuilder.setGearbox(gearbox);
        carBuilder.setEngineType(engineType);
        carBuilder.setBodyType(bodyType);
        carBuilder.setReviewUrl(review);

        Product2 car = carBuilder.getCar();
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
                UnitPrice = price,
                IsActive = true);
        Insert priceBookEntry;
    }

    @AuraEnabled
    public static String saveCarLwc(
            String pictureUrl,
            String manufacturer,
            String model,
            Integer horsepower,
            Date productionYear,
            String review,
            Double price,
            String bodyType,
            String gearbox,
            String engineType,
            Integer numberOfSeats,
            Double acceleration,
            Double averageFuelConsumption,
            Double engineCapacity,
            Integer height,
            Integer width,
            Integer length,
            Integer theSizeOfTheWheels
    ) {
        String productCode = 'CL' + manufacturer.toUpperCase() + model.toUpperCase();
        String productName = manufacturer + model;

        CarLeasingCarBuilder carBuilder = new CarLeasingCarBuilder();
        carBuilder.setPicture(pictureUrl);
        carBuilder.setProductCode(productCode);
        carBuilder.setProductName(productName);
        carBuilder.setManufacturer(manufacturer);
        carBuilder.setModel(model);
        carBuilder.setHorsepower(horsepower);
        carBuilder.setProductionYear(productionYear);
        carBuilder.setGearbox(gearbox);
        carBuilder.setEngineType(engineType);
        carBuilder.setBodyType(bodyType);
        carBuilder.setReviewUrl(review);
        carBuilder.setNumberOfSeats(numberOfSeats);
        carBuilder.setAcceleration(acceleration);
        carBuilder.setAverageFuelConsumption(averageFuelConsumption);
        carBuilder.setEngineCapacity(engineCapacity);
        carBuilder.setHeight(height);
        carBuilder.setWidth(width);
        carBuilder.setLength(length);
        carBuilder.setTheSizeOfTheWheels(theSizeOfTheWheels);

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
                UnitPrice = price,
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
    public static List<String> getEngineTypePickListValues() {
        List<String> pickListValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Product2.Engine_Type__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry pickListVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }

    @AuraEnabled
    public static List<String> getBodyTypePickListValues() {
        List<String> pickListValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Product2.Body_Type__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry pickListVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }

    @AuraEnabled
    public static List<String> gearboxPicklistValues() {
        List<String> pickListValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Product2.Gearbox__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry pickListVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId) {
        try {
            List<ContentVersion> contentVersions = [
                    SELECT
                            Id,
                            Title,
                            ContentDocumentId,
                            FileType,
                            ContentSize,
                            FileExtension,
                            VersionNumber,
                            CreatedDate,
                            VersionData,
                            FirstPublishLocationId
                    FROM ContentVersion
                    WHERE FirstPublishLocationId = :recordId
                    ORDER BY CreatedDate DESC
            ];
            return contentVersions;

        } catch (Exception e) {
            System.debug(e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String testFunction(String documentId) {
        return documentId;
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