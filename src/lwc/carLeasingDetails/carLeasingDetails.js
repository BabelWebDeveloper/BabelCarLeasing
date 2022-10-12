import { wire, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CAR_ID_FIELD from '@salesforce/schema/Product2.Id';
import CAR_NAME_FIELD from '@salesforce/schema/Product2.Name';
const CAR_FIELDS = [CAR_ID_FIELD, CAR_NAME_FIELD];

import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

export default class CarLeasingDetails extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext;
    carId;

    @wire(getRecord, {recordId: '$carId', fields: CAR_FIELDS})
    wiredRecord;

    get detailsTabIconName() {
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }

    get carName() {
        return getFieldValue(this.wiredRecord.data, CAR_NAME_FIELD);
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
            (message) => { this.carId = message.recordId },
            { scope: APPLICATION_SCOPE }
        );
    }

    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.carId,
                objectApiName: "Product2",
                actionName: "view"
            },
        });
    }
}