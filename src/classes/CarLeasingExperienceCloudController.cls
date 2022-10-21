public without sharing class CarLeasingExperienceCloudController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getAllCars() {
        List<PricebookEntry> priceBookEntries = [
                SELECT
                        Id, UnitPrice,
                        Product2.Manufacturer__c,
                        Product2.Model__c,
                        Product2.Horsepower__c,
                        Product2.Gearbox__c,
                        Product2.Engine_Type__c,
                        Product2.Picture__c,
                        Product2.Body_Type__c,
                        Product2.Year_of_production__c,
                        Product2.Width__c,
                        Product2.Height__c,
                        Product2.Length__c,
                        Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c,
                        Product2.Acceleration__c,
                        Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c,
                        Product2Id
                FROM PricebookEntry
                WHERE Pricebook2Id = :getActivePricebook()
                AND Product2Id IN (
                        SELECT Id
                        FROM Product2
                        WHERE ProductCode LIKE 'CL%'
                )
        ];

        return priceBookEntries;
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
                '        Product2.Year_of_production__c,\n' +
                '                        Product2.Width__c,\n' +
                '                        Product2.Height__c,\n' +
                '                        Product2.Length__c,\n' +
                '                        Product2.Number_of_seats__c,\n' +
                '                        Product2.Engine_capacity__c,\n' +
                '                        Product2.Acceleration__c,\n' +
                '                        Product2.Average_fuel_consumption__c,\n' +
                '                    Product2.The_size_of_the_wheels__c,' +
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
//            todo jesli trzeba dokleić warunkowe query
            query += ' AND (Product2.Manufacturer__c LIKE ' + '\'' + carNameSearchKey + '%\'';
            query += ' OR Product2.Model__c LIKE ' + '\'' + carNameSearchKey + '%\'' + '))';
        }
        System.debug(query);
        List<PriceBookEntry> pricebookEntries = Database.query(query);
        return pricebookEntries;
    }

    @AuraEnabled(cacheable=true)
    public static PriceBookEntry searchCarsById(String carId) {
        PriceBookEntry pricebookEntry = [
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
                        Product2.Year_of_production__c,
                        Product2.Width__c,
                        Product2.Height__c,
                        Product2.Length__c,
                        Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c,
                        Product2.Acceleration__c,
                        Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c,
                        Product2Id
                FROM PricebookEntry
                WHERE Pricebook2Id = :getActivePricebook()
                AND Product2Id = :carId
        ];
        return pricebookEntry;
    }

    @AuraEnabled(cacheable=true)
    public static User fetchUser() {
//        todo zmienić na listę
//        todo formatowanie
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

//    todo no hardcode!!

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
                        Product2.Body_Type__c,
                        Product2.Year_of_production__c,
                        Product2.Width__c,
                        Product2.Height__c,
                        Product2.Length__c,
                        Product2.Number_of_seats__c,
                        Product2.Engine_capacity__c,
                        Product2.Acceleration__c,
                        Product2.Average_fuel_consumption__c,
                        Product2.The_size_of_the_wheels__c,
                        Quantity,
                        OrderId,
                        Id,
                        UnitPrice
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

    @AuraEnabled
    public static void setActiveOrder(
            String billingStreet,
            String billingCity,
            String billingStateProvince,
            String billingCountry,
            String billingZipPostalCode,
            String orderId
    ) {
        System.debug(billingStreet +
                billingCity +
                billingStateProvince +
                billingCountry +
                billingZipPostalCode +
                orderId);
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
        order.Status = 'Activated';

        System.debug(order);
        try {
            update order;
        } catch (Exception e) {
            System.debug(e);
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentDistribution> getUrlsFromContentDistribution(String productId) {
        List<ContentDistribution> contentDistributions = [
                SELECT
                        Id,
                        Name,
                        DistributionPublicUrl,
                        ContentDownloadUrl
                FROM ContentDistribution
                WHERE Name LIKE :productId
        ];
        return contentDistributions;
    }
//    todo wyodrębić do innych klas single resp (do 100 linijek)

    @AuraEnabled(cacheable=true)
    public static List<Order> getActiveOrders(String userId) {
                List<Order> orders = [
                SELECT
                        Id,
                        CreatedById,
                        Status,
                        CreatedDate,
                        TotalAmount,
                        (
                                SELECT
                                        Id,
                                        Quantity,
                                        Product2.Manufacturer__c,
                                        Product2.Model__c,
                                        Product2.Picture__c,
                                        Product2.Horsepower__c,
                                        Product2.Engine_Type__c,
                                        Product2.Gearbox__c,
                                        TotalPrice
                                FROM OrderItems
                        )
                FROM Order
                WHERE CreatedById = :userId
                AND Status = 'Activated'
        ];
        return orders;
    }
}