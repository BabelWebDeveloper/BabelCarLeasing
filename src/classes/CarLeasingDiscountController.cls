public without sharing class CarLeasingDiscountController {
    @AuraEnabled
    public static Pricebook2 CreatePricebook(CarLeasingWrapper wrapper) {
        Pricebook2 pricebook2 = new Pricebook2();
        pricebook2.Name = wrapper.discountName;
        pricebook2.IsActive = true;

        if (wrapper.discountType == CarLeasingSettingService.DISCOUNT_TYPE_PERCENT) {
            pricebook2.Percent_discount__c = wrapper.discountValue;
        }
        if (wrapper.discountType == CarLeasingSettingService.DISCOUNT_TYPE_CURRENCY) {
            pricebook2.Currency_discount__c = wrapper.discountValue;
        }

        try {
            insert pricebook2;
            return pricebook2;
        } catch (Exception e) {
            System.debug(e);
        }
        return Pricebook2;
    }

    @AuraEnabled
    public static List<Pricebook2> GetAllPriceBooks() {
        return [
                SELECT Id, IsStandard, IsActive, Percent_discount__c, Currency_discount__c, Name
                FROM Pricebook2
                WHERE IsActive = TRUE
        ];
    }

    @AuraEnabled
    public static List<Product2> getAllProducts() {
        List<Product2> priceBookEntries = [
                SELECT Id, Model__c, Manufacturer__c, IsActive, (SELECT UnitPrice FROM PricebookEntries)
                FROM Product2
        ];

        return priceBookEntries;
    }

    @AuraEnabled
    public static void AssignPricebookToProduct(List<Product2> product2s, String pricebook2Id){
        Pricebook2 pricebook2 = [SELECT
                Id, IsActive, IsStandard, Currency_discount__c, Percent_discount__c
        FROM Pricebook2 WHERE Id =: pricebook2Id];

        List<PricebookEntry> customPricebookEntry = [
                SELECT Id, Product2Id, IsActive, Pricebook2Id, Pricebook2.IsStandard, Product2.Manufacturer__c, Product2.Model__c, UnitPrice
                FROM PricebookEntry
                WHERE Product2Id IN : product2s
                AND Pricebook2.IsStandard = FALSE
        ];

        Boolean isPricebookAlreadyAssignedToProduct = false;
        PricebookEntry assignedPriceBookEntry = new PricebookEntry();

        for (PricebookEntry pricebookEntry : customPricebookEntry){
            pricebookEntry.IsActive = false;
            if (pricebookEntry.Pricebook2Id == pricebook2Id) {
                isPricebookAlreadyAssignedToProduct = true;
                assignedPriceBookEntry = pricebookEntry;
            }
        }
        update customPricebookEntry;

        if (isPricebookAlreadyAssignedToProduct == true) {
            assignedPriceBookEntry.IsActive = true;
            update assignedPriceBookEntry;
        }
        else {
            List<PricebookEntry> standardPricebookEntry = [
                    SELECT Id, Product2Id, IsActive, Pricebook2Id, Pricebook2.IsStandard, Product2.Manufacturer__c, Product2.Model__c, UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id IN : product2s
                    AND Pricebook2.IsStandard = TRUE
            ];

            List<PricebookEntry> newPricebookEntry = new List<PricebookEntry>();
            for (PricebookEntry pricebookEntry : standardPricebookEntry){
                PricebookEntry pricebookEntry2 = new PricebookEntry();
                if (pricebook2.Currency_discount__c != 0 && pricebook2.Currency_discount__c != null) {
                    pricebookEntry2.UnitPrice = pricebookEntry.UnitPrice - pricebook2.Currency_discount__c;
                }
                if (pricebook2.Percent_discount__c != 0 && pricebook2.Percent_discount__c != null) {
                    pricebookEntry2.UnitPrice = pricebookEntry.UnitPrice * (1 - (pricebook2.Percent_discount__c * 0.01));
                }
                pricebookEntry2.Product2Id = pricebookEntry.Product2Id;
                pricebookEntry2.Pricebook2Id = pricebook2.Id;
                pricebookEntry2.IsActive = true;
                newPricebookEntry.add(pricebookEntry2);
            }
            try {
                insert newPricebookEntry;
            } catch (Exception e){
                System.debug(e);
            }
        }
    }

    @AuraEnabled
    public static void deletePricebook(String pricebookId){
        delete [SELECT Id FROM Pricebook2 WHERE Id =: pricebookId];
    }
}