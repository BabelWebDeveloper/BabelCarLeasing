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

    @wire(findCarsByName, {carNameSearchKey: '$searchKey'})
    wiredCars(result) {
        this.allCars = false;
        this.pricebookEntries = result;
        this.checkSizeOfResults(result);
    }

    @wire(getAllCars)
    getAllCars({data}) {
        if (data) {
            this.allCars = true;
            this.pricebookEntries = data;
            this.checkSizeOfResults(data);
        }
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
        this.sendMessageService(this.selectedCarId);
    }

    sendMessageService(carId) {
        publish(this.messageContext, carLeasingSearchChannel, {recordId: carId});
    }

    label = {
        There_is_no_records_based_on_such_criteria
    };
}