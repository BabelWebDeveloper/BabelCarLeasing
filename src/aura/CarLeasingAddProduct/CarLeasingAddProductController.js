({
    doInit : function(component) {
        console.log('init work');
        let engineTypePicklist = component.get("c.getEngineTypePickListValues");
        engineTypePicklist.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS'){
                let list = response.getReturnValue();
                component.set("v.engineTypePicklistValues", list);
            }
            else if(state === 'ERROR'){
                alert('ERROR OCCURED.');
            }
        })

        let bodyTypePicklist = component.get("c.getBodyTypePickListValues");
        bodyTypePicklist.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS'){
                let list = response.getReturnValue();
                component.set("v.bodyTypePicklistValues", list);
            }
            else if(state === 'ERROR'){
                alert('ERROR OCCURED.');
            }
        })

        let gearboxPicklist = component.get("c.gearboxPicklistValues");
        gearboxPicklist.setCallback(this, function(response) {
            let state = response.getState();
            if(state === 'SUCCESS'){
                let list = response.getReturnValue();
                component.set("v.gearboxPicklistValues", list);
            }
            else if(state === 'ERROR'){
                alert('ERROR OCCURED.');
            }
        })

        $A.enqueueAction(engineTypePicklist);
        $A.enqueueAction(bodyTypePicklist);
        $A.enqueueAction(gearboxPicklist);
    },

    setEngineType: function (component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set("v.engineType", selectCmp.get("v.picklist.Engine_Type__c"));
        return;
    },
    setBodyType: function(component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set( "v.bodyType", selectCmp.get("v.picklist.Body_Type__c") );
    },
    setGearbox: function(component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set("v.engineType", selectCmp.get("v.picklist.Gearbox__c"));
        return;
    },

    handleUploadFinished: function (component, event, helper) {
        if(event.getParam("files").length > 0) {
            let uploadedImage = event.getParam("files");
            let contentId;
            uploadedImage.forEach(file => contentId = file.documentId);
            let action = component.get('c.getPictureUrl');
            action.setParams({
                id: contentId
            });
            action.setCallback(this, function (response) {
                component.set("v.imageUrl", response.getReturnValue());
            });
            $A.enqueueAction(action);
        }
    },
    saveNewCar : function (component, event, helper){
        let imageUrl = component.get("v.imageUrl");
        let manufacturer = component.get("v.manufacturer");
        let productCode = component.get("v.productCode");
        let model = component.get("v.model");
        let horsepower = component.get("v.horsepower");
        let productionYear = component.get("v.productionYear");
        let engineType = component.get("v.picklist.Engine_Type__c");
        let bodyType = component.get("v.picklist.Body_Type__c");
        let gearbox = component.get("v.picklist.Gearbox__c");
        let price = component.get("v.price");
        let review = component.get("v.review");
        let productName = manufacturer + ' ' + model;

        let saveCarBackend = component.get( "c.saveCar" );

        saveCarBackend.setParams({
            imageUrl: imageUrl,
            productCode: productCode,
            productName: productName,
            manufacturer: manufacturer,
            model: model,
            horsepower: horsepower,
            productionYear: productionYear,
            gearbox: gearbox,
            engineType: engineType,
            bodyType: bodyType,
            review: review,
            price: price
        });

        saveCarBackend.setCallback( this, function( response ) {
            return;
        });
        $A.enqueueAction( saveCarBackend );
    },
});