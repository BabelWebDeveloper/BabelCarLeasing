public without sharing class CarLeasingExperienceCloudController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchCarsByName(String carNameSearchKey) {
        List<PriceBookEntry> pricebookEntries = [
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
                WHERE Pricebook2Id = :'01s7Q00000ChBWwQAN'
                AND Product2Id IN (
                        SELECT
                                Id
                        FROM Product2
                        WHERE
                                ProductCode LIKE 'CL%'
                                AND Name LIKE :carNameSearchKey + '%'
                )
        ];
        System.debug(pricebookEntries);
        return pricebookEntries;
    }
}