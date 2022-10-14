public with sharing class CarLeasingAdminController {
    @AuraEnabled
    public static String getPictureUrl(String id) {
        ContentVersion version = [SELECT Id FROM ContentVersion WHERE ContentDocumentId =: id LIMIT 1];
        return URL.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + version.Id;
    }
    
    @AuraEnabled
    public static void saveCar (
            String imageUrl,
            String productCode,
            String productName,
            String manufacturer,
            String model,
            Integer horsepower,
            Date productionYear,
            String gearbox,
            String engineType,
            String bodyType) {

        CarLeasingCarBuilder carBuilder = new CarLeasingCarBuilder();
        carBuilder.setPicture(imageUrl);
        carBuilder.setProductCode(productCode);
        carBuilder.setProductName(productName);
        carBuilder.setManufacturer(manufacturer);
        carBuilder.setModel(model);
        carBuilder.setHorsepower(horsepower);
        carBuilder.setProductionYear(productionYear);
        carBuilder.setGearbox(gearbox);
        carBuilder.setEngineType(engineType);
        carBuilder.setBodyType(bodyType);

        Product2 car = carBuilder.getCar();
        try {
            insert car;
        } catch (Exception e){
            System.debug(e);
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<PickListDetails> getPicklistvalues(String Product2, String field_name) {
        try{
            List <PickListDetails> lstPickvals = new List <PickListDetails>();
            Schema.SObjectType targetType = Schema.getGlobalDescribe().get(Product2);//From the Object Api name retrieving the SObject
            SObject Object_name = targetType.newSObject();
            Schema.sObjectType sobject_type = Object_name.getSObjectType(); //grab the sobject that was passed
            Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe(); //describe the sobject
            Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap(); //get a map of fields for the passed sobject
            List<Schema.PicklistEntry> pick_list_values = field_map.get(field_name).getDescribe().getPickListValues(); //grab the list of picklist values for the passed field on the sobject
            for (Schema.PicklistEntry a : pick_list_values) { //for all values in the picklist list
                if (a.isActive()) {
                    PickListDetails pickListdetailobj = new PickListDetails();
                    pickListdetailobj.label = a.getLabel();
                    pickListdetailobj.value = a.getValue();
                    lstPickvals.add(pickListdetailobj);//add the value to our final list
                }
            }
            system.debug('lstPickvals ::'+lstPickvals);
            return lstPickvals;
        }Catch(Exception ex){
            System.debug('Error!!!'+''+'Error on Line '+ex.getLineNumber()+' Cause : '+ex.getCause());
            throw new AuraHandledException(ex.getMessage());
        }

    }
    public class PickListDetails{
        @AuraEnabled
        public string label{get;set;}
        @AuraEnabled
        public string value{get;set;}
    }
}