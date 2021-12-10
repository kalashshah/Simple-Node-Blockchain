"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    constructor(amount, payer, receiver) {
        this.amount = amount;
        this.payer = payer;
        this.receiver = receiver;
        this.toString = () => JSON.stringify(this);
    }
}
