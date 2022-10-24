import {LightningElement, track, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import getActiveOrders from '@salesforce/apex/CarLeasingOrdersController.getActiveOrders';
import Created  from '@salesforce/label/c.Created';
import EUR  from '@salesforce/label/c.EUR';
import Quantity  from '@salesforce/label/c.Quantity';
import You_haven_t_had_any_orders_yet from '@salesforce/label/c.You_haven_t_had_any_orders_yet';

export default class CarLeasingOrders extends LightningElement {
    @track
    activeOrders;
    userId;

    label = {
        Created,
        EUR,
        Quantity,
        You_haven_t_had_any_orders_yet
    }

    connectedCallback() {
        this.userId = Id;
    }

    @wire(getActiveOrders,{userId: '$userId'})
    wiredOrders(result){
        this.activeOrders = result;
    }
}