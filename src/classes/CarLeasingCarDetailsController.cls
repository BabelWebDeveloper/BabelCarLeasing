/**
 * Created by przemyslaw.babel on 23.10.2022.
 */

public without sharing class CarLeasingCarDetailsController {
    @AuraEnabled(cacheable=true)
    public static PriceBookEntry searchCarsById(String carId) {
        List<PriceBookEntry> priceBookEntries = [
                SELECT Id, UnitPrice, Product2.Manufacturer__c, Product2.Model__c,
                        Product2.Horsepower__c, Product2.Gearbox__c, Product2.Engine_Type__c, Product2.Picture__c,
                        Product2.Body_Type__c, Product2.ReviewLink__c, Product2.Year_of_production__c,
                        Product2.Width__c, Product2.Height__c, Product2.Length__c,Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c, Product2.Acceleration__c, Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c, Product2Id, Pricebook2.IsActive,Pricebook2.IsStandard
                FROM PricebookEntry
                WHERE Pricebook2.IsStandard = TRUE
                AND Product2Id = :carId
        ];
        return priceBookEntries[0];
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentDistribution> getUrlsFromContentDistribution(String productId) {
        List<ContentDistribution> contentDistributions = [
                SELECT Id, Name, DistributionPublicUrl, ContentDownloadUrl
                FROM ContentDistribution
                WHERE Name LIKE :productId
        ];
        return contentDistributions;
    }
}