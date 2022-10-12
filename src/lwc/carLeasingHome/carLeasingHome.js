import {LightningElement} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
import backgroundUrl from '@salesforce/resourceUrl/clbgcbmw';
// import findYourPerfectLease from '@salesforce/label/c.FIND_YOUR_PERFECT_LEASE';

export default class CarLeasingHome extends LightningElement {
    get backgroundStyle() {
        return `height:50rem;background-image:url(${backgroundUrl})`;
    }

    label = {
        carLeasingLogoTransparent
    };
}