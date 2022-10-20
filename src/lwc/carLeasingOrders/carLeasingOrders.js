import {LightningElement, track, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import getActiveOrders from '@salesforce/apex/CarLeasingExperienceCloudController.getActiveOrders';

export default class CarLeasingOrders extends LightningElement {
    @track
    activeOrders;
    userId;

    connectedCallback() {
        this.userId = Id;
        console.log(this.userId);
    }

    @wire(getActiveOrders,{userId: '$userId'})
    wiredOrders(result){
        this.activeOrders = result;
        console.log('result: ' + result);
        console.log(result);
    }
}