import {LightningElement, wire, track} from 'lwc';
import {publish, MessageContext} from 'lightning/messageService';
import carLeasingSearchChannel from '@salesforce/messageChannel/carLeasingSearchChannel__c';
import Search_car from '@salesforce/label/c.Search_car';
import Search from '@salesforce/label/c.Search';

export default class CarLeasingSearchBYManufacturer extends LightningElement {
    searchKey = '';

    @track
    product2s;

    @wire(MessageContext)
    messageContext;

    isLoading = false;

    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }

    handleSearchKey(event) {
        this.searchKey = event.target.value;
    }

    setSearchKey() {
        const payload = {
            searchKeyManufacturer: this.searchKey
        };
        publish(this.messageContext, carLeasingSearchChannel, payload);
    }

    label = {
        Search_car,
        Search
    };
}