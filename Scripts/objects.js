class Resource {
    constructor (resources) {
        this.stone = resources[0];
    }

    add (resources) {
        var newResources = [];
        for (key of Object.keys(this)) {
            newResources.push(this[key]+resources[key])
        }
        return new Resources (newResources);
    }

    subtract (resources) {
        var newResources = [];
        for (key of Object.keys(this)) {
            newResources.push(this[key]-resources[key])
        }
        return new Resources (newResources);
    }

    toBoolean () {
        return Resource.toBoolean(this);
    }

    static toBoolean (resources) {
        for (value of Object.values(resources)) {
            if (value > 0) {
                return true;
            }
        }
        return false;
    }
}