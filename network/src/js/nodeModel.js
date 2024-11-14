import { v4 as uuidv4 } from 'uuid'

export class nodeModel {
    constructor(name, request, reminder) {
        this.id = uuidv4();
        this.name = name;
        this.request = request;
        this.reminder = reminder;
        this.customFields = [];
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }

    getRequest() {
        return this.request;
    }
    setRequest(request) {
        this.request = request;
    }
    
    getReminder() {
        return this.reminder;
    }
    setReminder(reminder) {
        this.reminder = reminder;
    }
    getCustomFields() {
        return this.customFields;
    }
    setCustomFields(customFields) {
        this.customFields = customFields;
    }
}