public with sharing class CL_ContentVersionService {
    public static void createContentDistribution (List<ContentVersion> updatedContentVersions){
        List<ContentDistribution> contentDistributions = new List<ContentDistribution>();
        for (ContentVersion contentVersion : updatedContentVersions) {
            ContentDistribution contentDistribution = new ContentDistribution();
            contentDistribution.ContentVersionId = contentVersion.Id;
            contentDistribution.PreferencesAllowViewInBrowser = true;
            contentDistribution.PreferencesPasswordRequired = false;
            contentDistribution.PreferencesNotifyRndtnComplete = false;
            contentDistribution.PreferencesNotifyOnVisit = false;
            contentDistribution.PreferencesLinkLatestVersion = true;
            contentDistribution.PreferencesExpires = false;
            contentDistribution.PreferencesAllowOriginalDownload = true;
            contentDistribution.PreferencesAllowPDFDownload = true;
            contentDistribution.Name = contentVersion.Product__c;
            contentDistributions.add(contentDistribution);
        }
        insert contentDistributions;
    }
}