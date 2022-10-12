public with sharing class CarLeasingPublicSiteController {
    public String success {get; set;}
    public String view {get; set;}
    public String customerName {get; set;}
    public Boolean redirectToThankYou {get; set;}
    public Boolean leadPage {get; set;}
    public Boolean caseView {get; set;}
    public PageReference getPageType {get; set;}
    public String redirectUrl {get; set;}

    public CarLeasingPublicSiteController() {
        leadPage = true;
        caseView = false;
        redirectToThankYou = false;
        redirectUrl = 'https://britenet8-dev-ed.my.salesforce-sites.com/carleasing?view=success';
        getPageType();
    }

    public PageReference getPageType() {
        if(ApexPages.currentPage().getParameters().get('view') == 'success') {
            leadPage = false;
            caseView = false;
            redirectToThankYou = true;
        }
        if (ApexPages.currentPage().getParameters().get('view') == 'case') {
            leadPage = false;
            redirectToThankYou = false;
            caseView = true;
        }
        return null;
    }

    public String redirectToSomePage(){
        String currentUrl = URL.getSalesforceBaseUrl().toExternalForm();
        redirectUrl = 'https://britenet8-dev-ed.my.salesforce-sites.com/carleasing?view=case';
        System.debug(redirectUrl);
        getPageType();
        return redirectUrl;
    }
}