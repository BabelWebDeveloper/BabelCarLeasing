public without sharing class CarLeasingCartController {
    @AuraEnabled(cacheable=true)
    public static String getActivePricebook() {
        PriceBook2 pb2Standard = [
                SELECT Id
                FROM Pricebook2
                WHERE IsActive = TRUE
        ];
        return pb2Standard.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Order getUserOrder(String userId) {
        Order order = [
                SELECT Id, OwnerId, Status
                FROM Order
                WHERE OwnerId = :userId
                AND Status =: CarLeasingSettingService.ORDER_STATUS_DRAFT
        ];
        return order;
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId) {
        List<OrderItem> orderItems = [
                SELECT Product2Id, Product2.Manufacturer__c, Product2.Model__c,Product2.Picture__c, Product2.Horsepower__c,
                        Product2.Engine_Type__c, Product2.Gearbox__c, Product2.Body_Type__c, Product2.Year_of_production__c,
                        Product2.Width__c, Product2.Height__c, Product2.Length__c, Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c,Product2.Acceleration__c,Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c,Quantity,OrderId,Id,UnitPrice
                FROM OrderItem
                WHERE OrderId = :orderId
        ];
        return orderItems;
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

    @AuraEnabled
    public static void createOrderItem(String carId, String manufacturer, String model, String picture,
            Double totalMonthlyPayment, Integer carsQuantity, Integer contractPeriod, Double startFee,
            String orderId,String userAccountId,Double unitPrice) {

        String pricebookId = getActivePricebook();
        String pricebookEntryId = getPricebookEntry(carId);

        if (orderId == null) {
            Order order = new Order();
            order.AccountId = userAccountId;
            order.EffectiveDate = System.today();
            order.Status = CarLeasingSettingService.ORDER_STATUS_DRAFT;
            order.PriceBook2Id = pricebookId;
            insert order;

            OrderItem lineItem = new OrderItem();
            lineItem.OrderId = order.id;
            lineItem.Quantity = carsQuantity;
            lineItem.UnitPrice = unitPrice;
            lineItem.Product2id = carId;
            lineItem.PricebookEntryId = pricebookEntryId;
            insert lineItem;

        } else {
            OrderItem lineItem = new OrderItem();
            lineItem.OrderId = orderId;
            lineItem.Quantity = carsQuantity;
            lineItem.UnitPrice = unitPrice;
            lineItem.Product2id = carId;
            lineItem.PricebookEntryId = pricebookEntryId;
            insert lineItem;
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getPricebookEntry(String productId) {
        PricebookEntry pricebookEntry = [
                SELECT
                        Id,
                        Name,
                        Product2Id
                FROM PricebookEntry
                WHERE Product2Id = :productId
        ];
        return pricebookEntry.Id;
    }

    @AuraEnabled
    public static void setActiveOrder(String billingStreet, String billingCity, String billingStateProvince,
            String billingCountry, String billingZipPostalCode, String orderId) {
        Order order = [
                SELECT
                        Id
                FROM Order
                WHERE Id = :orderId
        ];
        order.BillingStreet = billingStreet;
        order.BillingCity = billingStreet;
        order.BillingState = billingStreet;
        order.BillingCountry = billingStreet;
        order.BillingPostalCode = billingStreet;
        order.Status = CarLeasingSettingService.ORDER_STATUS_ACTIVATED;

        System.debug(order);
        try {
            update order;
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled
    public static void deleteOrderItem(String orderItemId) {
        OrderItem orderItem = [
                SELECT
                        Product2Id
                FROM OrderItem
                WHERE Id = :orderItemId
        ];
        delete orderItem;
    }
}