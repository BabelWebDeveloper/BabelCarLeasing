import {LightningElement, track, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import getActiveOrders from '@salesforce/apex/CarLeasingExperienceCloudController.getActiveOrders';
import Created  from '@salesforce/label/c.Created';
import Totalcost  from '@salesforce/label/c.Totalcost';
import EUR  from '@salesforce/label/c.EUR';
import Quantity  from '@salesforce/label/c.Quantity';
import You_haven_t_had_any_orders_yet from '@salesforce/label/c.You_haven_t_had_any_orders_yet';

export default class CarLeasingOrders extends LightningElement {
    @track
    activeOrders;
    userId;

    label = {
        Created,
        Totalcost,
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
        this.sortResult(result);
    }

    sortResult(result){
        result.forEach(order => console.log(order));
    }
}