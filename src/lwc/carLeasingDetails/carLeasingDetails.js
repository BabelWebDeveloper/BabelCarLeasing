import {track, wire, LightningElement} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import {getRecord, getFieldValue} from 'lightning/uiRecordApi';
import CAR_ID_FIELD from '@salesforce/schema/Product2.Id';
import CAR_MANUFACTURER_FIELD from '@salesforce/schema/Product2.Manufacturer__c';
import CAR_MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import CAR_HORSEPOWER_FIELD from '@salesforce/schema/Product2.Horsepower__c';
import CAR_GEARBOX_FIELD from '@salesforce/schema/Product2.Gearbox__c';
import CAR_ENGINE_TYPE_FIELD from '@salesforce/schema/Product2.Engine_Type__c';
import CAR_PICTURE_FIELD from '@salesforce/schema/Product2.Picture__c';
import CAR_BODY_TYPE_FIELD from '@salesforce/schema/Product2.Body_Type__c';

const CAR_FIELDS = [
    CAR_ID_FIELD,
    CAR_MANUFACTURER_FIELD,
    CAR_MODEL_FIELD,
    CAR_HORSEPOWER_FIELD,
    CAR_GEARBOX_FIELD,
    CAR_ENGINE_TYPE_FIELD,
    CAR_PICTURE_FIELD,
    CAR_BODY_TYPE_FIELD
];

import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';
import {subscribe, APPLICATION_SCOPE, MessageContext} from 'lightning/messageService';

export default class CarLeasingDetails extends NavigationMixin(LightningElement) {

    @track isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    @wire(MessageContext)
    messageContext;
    carId;

    @wire(getRecord, {recordId: '$carId', fields: CAR_FIELDS})
    wiredRecord;

    get detailsTabIconName() {
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }

    get carManufacturer() {
        return getFieldValue(this.wiredRecord.data, CAR_MANUFACTURER_FIELD);
    }

    get carModel() {
        return getFieldValue(this.wiredRecord.data, CAR_MODEL_FIELD);
    }

    get carHorsepower() {
        return getFieldValue(this.wiredRecord.data, CAR_HORSEPOWER_FIELD);
    }

    get carGearbox() {
        return getFieldValue(this.wiredRecord.data, CAR_GEARBOX_FIELD);
    }

    get carEngineType() {
        return getFieldValue(this.wiredRecord.data, CAR_ENGINE_TYPE_FIELD);
    }

    get carPicture() {
        return getFieldValue(this.wiredRecord.data, CAR_PICTURE_FIELD);
    }

    get carBodyType() {
        return getFieldValue(this.wiredRecord.data, CAR_BODY_TYPE_FIELD);
    }


    subscription = null;

    connectedCallback() {
        this.subscribeFromMessageChannel();
    }

    subscribeFromMessageChannel() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            carLeasingSearchChannel,
            (message) => {
                this.carId = message.recordId
            },
            {scope: APPLICATION_SCOPE}
        );
    }
}