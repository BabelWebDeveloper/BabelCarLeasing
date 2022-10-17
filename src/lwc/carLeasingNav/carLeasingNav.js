import {LightningElement, wire, track} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
// import logoUrl from '@salesforce/resourceUrl/clcart';
import isGuest from '@salesforce/user/isGuest';

import Id from '@salesforce/user/Id';
import {getRecord} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import PICTURE from '@salesforce/schema/User.SmallPhotoUrl';



export default class CarLeasingNav extends LightningElement {
    userId = Id;
    @track
    name;
    @track
    email;
    @track
    picture;
    @track
    error;

    label = {
        carLeasingLogoTransparent
    };


    isGuestUser = isGuest;

    @wire(getRecord, {recordId: Id, fields: [NAME_FIELD, EMAIL_FIELD, PICTURE]})
    userDetails({error, data}) {
        if (data) {
            this.name = data.fields.Name.value;
            this.email = data.fields.Email.value;
            this.picture = 'https://bwd2-dev-ed.file.force.com/' + data.fields.SmallPhotoUrl.value;
        } else if (error) {
            this.error = error;
        }
    }

    out() {
        window.location.href = '/secur/logout.jsp';
    }


    // get logoStyle() {
    //     return `height:50px;background-image:url(${logoUrl})`;
    // }
}