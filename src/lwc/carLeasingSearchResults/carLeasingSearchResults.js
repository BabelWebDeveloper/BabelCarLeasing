import {LightningElement, track, wire, api} from 'lwc';
import {subscribe, publish, MessageContext} from 'lightning/messageService';
import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';
import findCarsByName from '@salesforce/apex/CarLeasingExperienceCloudController.searchCarsByName';
import getAllCars from '@salesforce/apex/CarLeasingExperienceCloudController.getAllCars';
import There_is_no_records_based_on_such_criteria from '@salesforce/label/c.There_is_no_records_based_on_such_criteria';

export default class CarLeasingSearchResults extends LightningElement {
    subscription = null;

    @wire(MessageContext)
    messageContext;
    searchKey;

    @track
    pricebookEntries;
    allCars = true;
    isLoading = false;

    @api
    selectedCarId;

    connectedCallback() {
        this.subscribeFromMessageChannel();
        this.isLoading = true;
    }

    subscribeFromMessageChannel() {
        this.isLoading = true;
        this.subscription = subscribe(
            this.messageContext,
            carLeasingSearchChannel,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.notifyLoading(this.isLoading);
        this.searchKey = message.searchKeyManufacturer;
    }

    @wire(findCarsByName, {carNameSearchKey: '$searchKey'})
    wiredCars(result) {
        this.allCars = false;
        this.pricebookEntries = result;
        this.isLoading = false;
    }

    @wire(getAllCars)
    getAllCars({data}) {
        if (data) {
            this.allCars = true;
            this.pricebookEntries = data;
            this.isLoading = false;
        }
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }

    updateSelectedTile(event) {
        this.selectedCarId = event.detail.carId;
        this.sendMessageService(this.selectedCarId);
    }

    sendMessageService(carId) {
        publish(this.messageContext, carLeasingSearchChannel, {recordId: carId});
    }

    label = {
        There_is_no_records_based_on_such_criteria
    };
}