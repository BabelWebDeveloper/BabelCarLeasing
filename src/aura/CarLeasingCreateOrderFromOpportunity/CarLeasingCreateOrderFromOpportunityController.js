({
    init: function (component, event, helper) {
        console.log('work')
        var action = component.get("c.createOrder");
        var oppId = component.get("v.recordId");

        action.setParams({oppId: oppId});
        action.setCallback(this, function (response) {
        });
        $A.enqueueAction(action);
        $A.get("e.force:closeQuickAction").fire();
        var a = component.get('c.showToast');
        $A.enqueueAction(a);
    },

    close: function (component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

    showToast: function (component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "The order has been created successfully.",
            "type": "success"
        });
        toastEvent.fire();
    }
})