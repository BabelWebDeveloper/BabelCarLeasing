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
    public static void createOrderItem(
            String carId,
            String manufacturer,
            String model,
            String picture,
            Double totalMonthlyPayment,
            Integer carsQuantity,
            Integer contractPeriod,
            Double startFee,
            String orderId,
            String userAccountId,
            Double unitPrice) {

        String pricebookId = getActivePricebook();
        String pricebookEntryId = getPricebookEntry(carId);

        if (orderId == null) {
            Order order = new Order();
            order.AccountId = userAccountId;
            order.EffectiveDate = System.today();
            order.Status = 'Draft';
            order.PriceBook2Id = pricebookId;
            insert order;

            OrderItem lineItem = new OrderItem();
            lineItem.OrderId = order.id;
            lineItem.Quantity = carsQuantity;
            lineItem.UnitPrice = totalMonthlyPayment;
            lineItem.Product2id = carId;
            lineItem.PricebookEntryId = pricebookEntryId;
            insert lineItem;

        } else {
            OrderItem lineItem = new OrderItem();
            lineItem.OrderId = orderId;
            lineItem.Quantity = carsQuantity;
            lineItem.UnitPrice = totalMonthlyPayment;
            lineItem.Product2id = carId;
            lineItem.PricebookEntryId = pricebookEntryId;
            insert lineItem;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId) {
        List<OrderItem> orderItems = [
                SELECT
                        Product2Id,
                        Product2.Manufacturer__c,
                        Product2.Model__c,
                        Product2.Picture__c,
                        Product2.Horsepower__c,
                        Product2.Engine_Type__c,
                        Product2.Gearbox__c,
                        Quantity,
                        OrderId,
                        Id
                FROM OrderItem
                WHERE OrderId = :orderId
        ];
        return orderItems;
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