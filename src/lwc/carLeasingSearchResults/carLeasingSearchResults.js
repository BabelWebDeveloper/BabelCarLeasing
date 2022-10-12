import {LightningElement, track, wire, api} from 'lwc';
import {subscribe, publish, MessageContext} from 'lightning/messageService';
import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';
import findpricebookEntriesByName from '@salesforce/apex/CarLeasingExperienceCloudController.searchCarsByName';

export default class CarLeasingSearchResults extends LightningElement {
    subscription = null;

    @wire(MessageContext)
    messageContext;

    searchKey;

    @track
    pricebookEntries;
    isLoading = false;

    @api
    selectedCarId;

    @track
    emptyResults = false;

    connectedCallback() {
        this.subscribeFromMessageChannel();
    }

    subscribeFromMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            carLeasingSearchChannel,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.searchKey = message.searchKeyManufacturer;
    }

    @wire(findpricebookEntriesByName, {carNameSearchKey: '$searchKey'})
    wiredCars(result) {
        this.pricebookEntries = result;
        this.notifyLoading(false);
        this.checkSizeOfResults(result);
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }

    checkSizeOfResults(result) {
        if (result.data !== undefined) {
            if (result.data.length < 1) {
                this.emptyResults = true;
            } else {
                this.emptyResults = false;
            }
        }
    }

    updateSelectedTile(event) {
        this.selectedCarId = event.detail.carId;
        this.sendMessageService(this.selectedCarId)
    }

    sendMessageService(carId) {
        publish(this.messageContext, carLeasingSearchChannel, {recordId: carId});
    }
}