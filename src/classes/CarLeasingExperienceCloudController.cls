public without sharing class CarLeasingExperienceCloudController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getAllCars() {
        return [
                SELECT
                        Id,
                        UnitPrice,
                        Product2.Manufacturer__c,
                        Product2.Model__c,
                        Product2.Horsepower__c,
                        Product2.Gearbox__c,
                        Product2.Engine_Type__c,
                        Product2.Picture__c,
                        Product2.Body_Type__c,
                        Product2Id
                FROM PricebookEntry
                WHERE Pricebook2Id = :getActivePricebook()
                AND Product2Id IN (
                        SELECT
                                Id
                        FROM Product2
                        WHERE
                                ProductCode LIKE 'CL%'
                )
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchCarsByName(String carNameSearchKey) {
        String query = 'SELECT\n' +
                '        Id,\n' +
                '        UnitPrice,\n' +
                '        Product2.Manufacturer__c,\n' +
                '        Product2.Model__c,\n' +
                '        Product2.Horsepower__c,\n' +
                '        Product2.Gearbox__c,\n' +
                '        Product2.Engine_Type__c,\n' +
                '        Product2.Picture__c,\n' +
                '        Product2.Body_Type__c,\n' +
                '        Product2Id\n' +
                'FROM PricebookEntry\n' +
                'WHERE Pricebook2Id = ' + '\'' + getActivePricebook() + '\'' +
                'AND Product2Id IN (\n' +
                '        SELECT\n' +
                '                Id\n' +
                '        FROM Product2\n' +
                '        WHERE\n' +
                '                ProductCode LIKE \'CL%\'\n' +
                ')';
        if (String.isNotEmpty(carNameSearchKey)) {
            query = query.removeEnd(')');
            query += ' AND Name LIKE ' + '\'' + carNameSearchKey + '%\'' + ')';
        }
        List<PriceBookEntry> pricebookEntries = Database.query(query);
        return pricebookEntries;
    }

    @AuraEnabled(cacheable=true)
    public static PriceBookEntry searchCarsById(String carId) {
        PriceBookEntry car = [
                SELECT
                        Id,
                        UnitPrice,
                        Product2.Manufacturer__c,
                        Product2.Model__c,
                        Product2.Horsepower__c,
                        Product2.Gearbox__c,
                        Product2.Engine_Type__c,
                        Product2.Picture__c,
                        Product2.Body_Type__c,
                        Product2.ReviewLink__c,
                        Product2Id
                FROM PricebookEntry
                WHERE Pricebook2Id = :getActivePricebook()
                AND Product2Id = :carId
        ];
        System.debug(car);
        return car;
    }

    @AuraEnabled(cacheable=true)
    public static User fetchUser() {
        User user = [
                SELECT
                        Id,
                        Name,
                        SmallPhotoUrl
                FROM User
                WHERE Id = :userInfo.getUserId()
        ];
        return user;
    }

    @AuraEnabled(cacheable=true)
    public static Order getUserOrder(String userId) {
        Order pb2Standard = [
                SELECT Id, OwnerId, Status
                FROM Order
                WHERE OwnerId = :userId
                AND Status = 'Draft'
        ];
        return pb2Standard;
    }

    @AuraEnabled(cacheable=true)
    public static String getActivePricebook() {
        PriceBook2 pb2Standard = [
                SELECT Id
                FROM Pricebook2
                WHERE IsActive = true
        ];
        return pb2Standard.Id;
    }

    @AuraEnabled(cacheable=true)
    public static String getUserAccountId(String userId) {
        User user = [
                SELECT Account.Id
                FROM User
                WHERE Id = :userId
        ];
        return user.Account.Id;
    }
}