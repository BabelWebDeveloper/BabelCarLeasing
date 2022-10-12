import { LightningElement, wire, track } from 'lwc';
import findproduct2sByName from '@salesforce/apex/CarLeasingExperienceCloudController.searchCarsByName';

export default class ApexWireMethodWithParams extends LightningElement {
    searchKey;
    @track product2s;

    handleSearchKey(event){
        this.searchKey = event.target.value;
    }

    SearchCarsHandler(){
        findproduct2sByName({carNameSearchKey: this.searchKey})
            .then(result => {
                this.product2s = result;
            })
            .catch( error=>{
                this.product2s = null;
            });
    }

    cols = [
        {label:'Model', fieldName:'Name' , type:'text'},
        {label:'Model', fieldName:'Name' , type:'text'},
        {label:'Model', fieldName:'Name' , type:'text'}
    ]
}