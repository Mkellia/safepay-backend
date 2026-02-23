class CreateOrderDTO {
    constructor(data) {
        this.sellerId = data.sellerId;
        this.amount = data.amount;
        this.itemName = data.itemName;
        this.otp = data.otp;
    }
}

module.exports = { CreateOrderDTO };
