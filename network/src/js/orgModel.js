import { nodeModel } from "./nodeModel";

export class Organization extends nodeModel {
    constructor(name, description, website, request, reminder) {
        super(name, request, reminder)   
        this.description = description;
        this.website = website;
    }

    getDescription() {
        return this.description;
    }
    setDescription(description) {
        this.description = description;
    }

    getWebsite() {
        return this.website;
    }
    setWebsite(website) {
        this.website = website;
    }

}