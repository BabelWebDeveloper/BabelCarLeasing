import {LightningElement, track, wire} from 'lwc';
import userOrderItems from '@salesforce/apex/CarLeasingExperienceCloudController.getOrderItems';
import Cart_items  from '@salesforce/label/c.Cart_items';
import Quantity  from '@salesforce/label/c.Quantity';
import Your_cart_is_empty  from '@salesforce/label/c.Your_cart_is_empty';

export default class CarLeasingCartItems extends LightningElement {
    @track
    orderId;
    orderItems;

    label = {
        Cart_items,
        Quantity,
        Your_cart_is_empty
    }
    
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