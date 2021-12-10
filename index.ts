import * as crypto from "crypto";

class Transaction {
  constructor (
    public amount: number,
    public payer: string,
    public receiver: string
  ) {}

  toString = () => JSON.stringify(this);
}
