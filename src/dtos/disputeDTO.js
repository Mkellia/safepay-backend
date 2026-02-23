class CreateDisputeDTO {
    constructor(data) {
        this.orderId = data.orderId;
        this.reason = data.reason;
    }
}

module.exports = { CreateDisputeDTO };
