import {LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingExperienceCloudController.getActivePricebook';
import userOrder from '@salesforce/apex/CarLeasingExperienceCloudController.getUserOrder';
import userAccountId from '@salesforce/apex/CarLeasingExperienceCloudController.getUserAccountId';


export default class CarLeasingCart extends LightningElement {

    @track
    userId;

    connectedCallback() {
        console.log('ccallback');
        console.log(Id);
        this.userId = Id;
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data !== undefined) {
            console.log('work');
            console.log(result.data);
        }
    }

    //
    // connectedCallback() {
    //     this.userId = Id;
    //     activePricebookId()
    //         .then((result) => {
    //             console.log(result);
    //         })
    //         .catch((error) => {
    //             this.error = error;
    //             console.log('Error is', this.error);
    //         });
    // }
    //
    // @wire(userAccountId, {userId: '$userId'})
    // wiredPricebook(result) {
    //     if (result.data !== undefined) {
    //         console.log(result.data);
    //     }
    // }

}