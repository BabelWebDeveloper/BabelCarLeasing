trigger CarLeasingContentVersionTrigger on ContentVersion (after update) {
    CL_ContentVersionTriggerDispatcher.run(new CL_ContentVersionTriggerHandler());
}