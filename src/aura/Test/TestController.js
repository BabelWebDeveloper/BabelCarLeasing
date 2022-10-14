({
    setGearbox: function(component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set( "v.gearbox", selectCmp.get("v.value") );
        return;
    },
    setBodyType: function(component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set( "v.bodyType", selectCmp.get("v.value") );
        return;
    },
    setEngineType: function (component) {
        let selectCmp = component.find("InputSelectSingleNew");
        component.set("v.engineType", selectCmp.get("v.value"));
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
        let gearbox = component.get("v.gearbox");
        let engineType = component.get("v.engineType");
        let bodyType = component.get("v.bodyType");
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
            bodyType: bodyType
        });

        saveCarBackend.setCallback( this, function( response ) {
            return;
        });
        $A.enqueueAction( saveCarBackend );
    },
});