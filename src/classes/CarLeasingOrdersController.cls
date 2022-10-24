public without sharing class CarLeasingOrdersController {
    @AuraEnabled(cacheable=true)
    public static List<Order> getActiveOrders(String userId) {
        List<Order> orders = [
                SELECT Id, CreatedById, Status, CreatedDate, TotalAmount,
                (SELECT Id, Quantity, Product2.Manufacturer__c, Product2.Model__c,Product2.Picture__c,
                        Product2.Horsepower__c,Product2.Engine_Type__c,Product2.Gearbox__c,TotalPrice
                FROM OrderItems)
                FROM Order
                WHERE CreatedById = :userId
                AND Status =: CarLeasingSettingService.ORDER_STATUS_ACTIVATED
        ];

        return orders;
    }
}