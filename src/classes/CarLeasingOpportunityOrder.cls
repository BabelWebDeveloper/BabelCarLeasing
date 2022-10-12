public with sharing class CarLeasingOpportunityOrder {
//    test przemo
    @AuraEnabled
    public static list<Order> createOrder(Id oppId) {
        List<OpportunityLineItem > opl = [SELECT  UnitPrice, Id, Quantity, TotalPrice  FROM OpportunityLineItem  WHERE OpportunityId =:oppId Order By CreatedDate   ASC];
        System.debug('opp list items for this: ' + opl);
        List<Order> orders = new List<Order>();
        if(opl.size() > 0 && oppId != null){
            Opportunity OpportunityInfo = [SELECT Pricebook2Id,  AccountId, ContactId, Order_Generated__c, OwnerId  FROM Opportunity WHERE Id =:oppId];
            List<OpportunityLineItem> OpportunityLineItems = [SELECT  UnitPrice, Quantity, PricebookEntryId,Id FROM OpportunityLineItem WHERE Id IN :opl];
            //Insert Order
            Order order = New Order();
            order.AccountId = OpportunityInfo.AccountId;
            order.BillToContactId = OpportunityInfo.ContactId;
            order.EffectiveDate = date.today();
            order.Status='Draft';
            order.Pricebook2Id=OpportunityInfo.Pricebook2Id;
            order.EndDate  = date.today()+30;
            order.OpportunityId=OpportunityInfo.Id;
            Insert order;

            List<OrderItem> OrderLineItems = New List<OrderItem>();
            List<OpportunityLineItem> oppLineItemItems = New List<OpportunityLineItem>();
            for(OpportunityLineItem oppLineItem : OpportunityLineItems){
                OrderItem orderItem = New OrderItem();
                orderItem.Quantity = oppLineItem.Quantity;
                PricebookEntry pb = [SELECT Product2Id, Pricebook2Id   FROM PricebookEntry WHERE Id =:oppLineItem.PricebookEntryId];
                orderItem.Product2Id = pb.Product2Id;
                orderItem.OrderId =order.Id;
                orderItem.UnitPrice  = oppLineItem.UnitPrice;
                orderItem.PricebookEntryId=oppLineItem.PricebookEntryId;
                OrderLineItems.add(orderItem);
            }
            Insert OrderLineItems;

            OpportunityInfo.Order_Generated__c = true;
            OpportunityInfo.StageName='Closed';
            upsert OpportunityInfo;

            orders=[select Id from Order where Id = :order.Id];

        }
        return orders;
    }
}