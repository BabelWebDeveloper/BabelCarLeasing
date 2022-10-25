public without sharing class CarLeasingCarDetailsController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchCarsById(String carId) {
        List<PriceBookEntry> priceBookEntries = [
                SELECT Id, UnitPrice, IsActive, Product2.Manufacturer__c, Product2.Model__c,
                        Product2.Horsepower__c, Product2.Gearbox__c, Product2.Engine_Type__c, Product2.Picture__c,
                        Product2.Body_Type__c, Product2.ReviewLink__c, Product2.Year_of_production__c,
                        Product2.Width__c, Product2.Height__c, Product2.Length__c, Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c, Product2.Acceleration__c, Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c, Product2Id, Pricebook2.IsActive, Pricebook2.IsStandard
                FROM PricebookEntry
                WHERE Pricebook2.IsActive = TRUE
                AND IsActive = TRUE
                AND Product2Id = :carId
                LIMIT 2
        ];
        return priceBookEntries;
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

    @AuraEnabled(cacheable=true)
    public static List<Comment__c> getAllComments(String product2Id) {
        return [
                SELECT
                        Id, CommentText__c, Rating__c, Product__c, CreatedById
                FROM Comment__c
                WHERE Product__c = :product2Id
        ];
    }

    @AuraEnabled
    public static Comment__c createComment(String product2Id, Integer rate, String commentText) {
        Comment__c comment = new Comment__c();
        comment.Product__c = product2Id;
        comment.Rating__c = rate;
        comment.CommentText__c = commentText;

        insert comment;
        return comment;
    }


}