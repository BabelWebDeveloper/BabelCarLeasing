import {LightningElement, track, wire} from 'lwc';
import userOrderItems from '@salesforce/apex/CarLeasingExperienceCloudController.getOrderItems';

export default class CarLeasingCartItems extends LightningElement {
    @track
    orderId;
    orderItems;
    
    connectedCallback() {
        let record = this.getOrderId();
        this.orderId = record.recordId;
        console.log('car items4');
        console.log(this.orderId);
    }
    getOrderId() {
        let params = {};
        let search = location.search.substring(1);

        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === "" ? value : decodeURIComponent(value)
            });
        }

        return params;
    }

    @wire(userOrderItems, {orderId: '$orderId'})
    wiredOrderItems(result) {
        console.log(result.data);
        this.orderItems = result.data;
    }
}