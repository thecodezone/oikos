import { nodeModel } from "./nodeModel";

export class Person extends nodeModel {
    constructor(name, phone, status, request, reminder, customFields) {
        super(name, request, reminder)
        this.phone = phone;
        this.status = status;
        this.customFields = customFields;
    }

    getPhone() {
        return this.phone;
    }
    setPhone(phone) {
        this.phone = phone;
    }

    getStatus() {
        return this.status;
    }
    setStatus(status) {
        this.status = status;
    }

}