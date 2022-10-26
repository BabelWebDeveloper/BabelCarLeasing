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
    showConnectedMessage;

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
        if (result.data !== undefined){
            if (result.data.length !== 0){
                this.showConnectedMessage = false;
            } else {
                this.showConnectedMessage = true;
            }
            this.reformatResults(result);
        }
    }

    reformatResults(result){
        let tempProps = JSON.parse(JSON.stringify(result));
        if (result.data){
            tempProps.data.forEach(order => {
                order.CreatedDate = order.CreatedDate.slice(0, -8).replace('T', ' ');
                Object.preventExtensions(tempProps);
            });
            Object.preventExtensions(tempProps);
            this.activeOrders = tempProps;
        }
    }

    reportProblem(event) {
        let targetId = event.target.dataset.targetId;
        console.log(targetId);
        let target = this.template.querySelector(`[data-id="${targetId}"]`);
    }
}