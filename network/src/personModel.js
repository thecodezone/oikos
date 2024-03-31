class Person {
    constructor(name, phone, status, request, reminder) {
        this.name = name;
        this.phone = phone;
        this.status = status;
        this.request = request;
        this.reminder = reminder;
    }

    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
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

}