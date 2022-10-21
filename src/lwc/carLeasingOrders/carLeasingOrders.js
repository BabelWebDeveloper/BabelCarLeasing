import {LightningElement, track, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import getActiveOrders from '@salesforce/apex/CarLeasingExperienceCloudController.getActiveOrders';
import Created  from '@salesforce/label/c.Created';
import Totalcost  from '@salesforce/label/c.Totalcost';
import EUR  from '@salesforce/label/c.EUR';
import Quantity  from '@salesforce/label/c.Quantity';


export default class CarLeasingOrders extends LightningElement {
    @track
    activeOrders;
    userId;

    label = {
        Created,
        Totalcost,
        EUR,
        Quantity
    }

    connectedCallback() {
        this.userId = Id;
        console.log(this.userId);
    }

    @wire(getActiveOrders,{userId: '$userId'})
    wiredOrders(result){
        // for (let i = 0; i < result.data.length; i++){
        //     let date = result.data[i].CreatedDate;
        //     date = date.substring(0, date.length - 8);
        //     date = date.replace("T", " at ");
        // }
        console.log(result);
        this.activeOrders = result;
    }
}