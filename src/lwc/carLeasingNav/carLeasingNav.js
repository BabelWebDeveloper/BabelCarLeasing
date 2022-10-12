import {LightningElement, wire, track} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
import isGuest from '@salesforce/user/isGuest';

import Id from '@salesforce/user/Id';
import {getRecord} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';

export default class CarLeasingNav extends LightningElement {
    userId = Id;
    @track
    name;
    @track
    email;
    @track
    error;

    label = {
        carLeasingLogoTransparent
    };


    isGuestUser = isGuest;

    @wire(getRecord, {recordId: Id, fields: [NAME_FIELD, EMAIL_FIELD]})
    userDetails({error, data}) {
        if (data) {
            this.name = data.fields.Name.value;
            this.email = data.fields.Email.value;
        } else if (error) {
            this.error = error;
        }
    }

    logout123() {
        // window.location.replace("https://bwd2-dev-ed.my.salesforce.com/servlet/networks/switch?startURL=%2Fsecur%2Flogout.jsp");
        window.location.href = '/secur/logout.jsp';
    }
}