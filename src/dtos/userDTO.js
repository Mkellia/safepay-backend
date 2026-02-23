class CreateUserDTO {
    constructor(data) {
        this.name = data.name;
        this.phone = data.phone;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'BUYER';
    }
}

module.exports = { CreateUserDTO };
