public without sharing class CarLeasingSearchController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchCarsByName(String carNameSearchKey) {
        List<PricebookEntry> priceBookEntries = new List<PricebookEntry>();
        if (!String.isEmpty(carNameSearchKey)) {
            carNameSearchKey += CarLeasingSettingService.SOQL_WILDCARD;
            priceBookEntries = [
                    SELECT UnitPrice, Product2.Manufacturer__c, Product2.Model__c, Product2.Horsepower__c,
                            Product2.Gearbox__c, Product2.Engine_Type__c, Product2.Picture__c, Product2.Body_Type__c,
                            Product2.Year_of_production__c, Product2.Width__c, Product2.Height__c, Product2.Length__c,
                            Product2.Number_of_seats__c, Product2.Engine_capacity__c, Product2.Acceleration__c,
                            Product2.Average_fuel_consumption__c, Product2.The_size_of_the_wheels__c, Product2Id,
                            Pricebook2.IsStandard, Pricebook2.IsActive
                    FROM PricebookEntry
                    WHERE Pricebook2.IsStandard = TRUE
                    AND Product2Id IN (
                            SELECT Id
                            FROM Product2
                            WHERE Product2.Manufacturer__c LIKE :carNameSearchKey
                            OR Product2.Model__c LIKE :carNameSearchKey
                    )
            ];
        } else {
            priceBookEntries = [
                    SELECT UnitPrice, Product2.Manufacturer__c, Product2.Model__c, Product2.Horsepower__c,
                            Product2.Gearbox__c, Product2.Engine_Type__c, Product2.Picture__c, Product2.Body_Type__c,
                            Product2.Year_of_production__c, Product2.Width__c, Product2.Height__c, Product2.Length__c,
                            Product2.Number_of_seats__c, Product2.Engine_capacity__c, Product2.Acceleration__c,
                            Product2.Average_fuel_consumption__c, Product2.The_size_of_the_wheels__c, Product2Id,
                            Pricebook2.IsStandard, Pricebook2.IsActive
                    FROM PricebookEntry
                    WHERE Pricebook2.IsStandard = TRUE
            ];
        }
        return pricebookEntries;
    }

    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getAllCars() {
        List<PricebookEntry> priceBookEntries = [
                SELECT UnitPrice, Product2.Manufacturer__c, Product2.Model__c, Product2.Horsepower__c,
                        Product2.Gearbox__c, Product2.Engine_Type__c, Product2.Picture__c,
                        Product2.Body_Type__c, Product2.Year_of_production__c, Product2.Width__c,
                        Product2.Height__c, Product2.Length__c, Product2.Number_of_seats__c, Product2.Engine_capacity__c,
                        Product2.Acceleration__c, Product2.Average_fuel_consumption__c, Product2.The_size_of_the_wheels__c,
                        Product2Id, Pricebook2.IsStandard
                FROM PricebookEntry
                WHERE Pricebook2.IsStandard = TRUE
        ];

        return priceBookEntries;
    }
}