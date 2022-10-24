public without sharing class CarLeasingDiscountController {
    @AuraEnabled
    public static Pricebook2 CreatePricebook(CarLeasingWrapper wrapper) {
        Pricebook2 pricebook2 = new Pricebook2();
        pricebook2.Name = wrapper.discountName;
        pricebook2.IsActive = false;

        if (wrapper.discountType == CarLeasingSettingService.DISCOUNT_TYPE_PERCENT) {
            wrapper.discountValue = (Integer) pricebook2.Percent_discount__c;
        }
        if (wrapper.discountType == CarLeasingSettingService.DISCOUNT_TYPE_CURRENCY) {
            wrapper.discountValue = (Double) pricebook2.Currency_discount__c;
        }

        try {
            insert pricebook2;
            return pricebook2;
        } catch (Exception e) {
            System.debug(e);
        }
        return null;
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
                SELECT Id, Model__c, Manufacturer__c, (SELECT Pricebook2.Name FROM PricebookEntries)
                FROM Product2
        ];

        return priceBookEntries;
    }

    @AuraEnabled
    public static Pricebook2 AssignPricebookToProduct(List<String> productIds, Pricebook2 discountId){
//- wybieramy pricebook oraz product
//- jeśli wybrany pricebook jest standardowy wtedy usuwamy pozostałe pricebookEntry dla tego produktu
//- jeśli nie jest:
//	- dodaje się nowy pricebookEntry
//	- Trigger before insert na pricebookEntry który wyszuka wszystkie pricebookiEntry powiązane z danym produktem
//	i wyłączy wszystkie pricebookiEntry które pochodzą od tych pricebooków które nie są standardowe
        return discountId;
    }
}