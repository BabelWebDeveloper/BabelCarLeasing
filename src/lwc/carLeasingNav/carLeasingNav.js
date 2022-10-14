import {LightningElement, wire, track} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
import isGuest from '@salesforce/user/isGuest';

import Id from '@salesforce/user/Id';
import {getRecord} from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
import PICTURE from '@salesforce/schema/User.SmallPhotoUrl';

import getUser from '@salesforce/apex/CarLeasingExperienceCloudController.fetchUser';

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

    // connectedCallback() {
    //     super.connectedCallback();
    // }

    isGuestUser = isGuest;

    @wire(getRecord, {recordId: Id, fields: [NAME_FIELD, EMAIL_FIELD, PICTURE]})
    userDetails({error, data}) {
        if (data) {
            this.name = data.fields.Name.value;
            this.email = data.fields.Email.value;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getUser)
    userInfo({data}) {
        console.log(data);
    };

    out() {
        window.location.href = '/secur/logout.jsp';
    }
}