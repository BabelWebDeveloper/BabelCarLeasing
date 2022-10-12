import {LightningElement} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
import backgroundUrl from '@salesforce/resourceUrl/clbgcbmw';

export default class CarLeasingHome extends LightningElement {
    get backgroundStyle() {
        return `height:50rem;background-image:url(${backgroundUrl})`;
    }

    label = {
        carLeasingLogoTransparent
    };
}