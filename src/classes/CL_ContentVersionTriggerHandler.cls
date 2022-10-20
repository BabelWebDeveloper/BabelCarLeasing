public with sharing class CL_ContentVersionTriggerHandler implements ICL_ContentVersionTrigger{
    public void AfterUpdate(List<ContentVersion> updatedContentVersions){
        CL_ContentVersionService.createContentDistribution(updatedContentVersions);
    }
}