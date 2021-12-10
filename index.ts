import * as crypto from "crypto";

class Transaction {
  constructor(
    public amount: number,
    public payer: string,
    public receiver: string
  ) {}

  toString = () => JSON.stringify(this);
}

class Block {
  constructor(
    public prevHash: string,
    public transaction: Transaction,
    // To order blocks in order
    private timestamp = Date.now()
  ) {}

  getHash = () => {
    const str = JSON.stringify(this);
    // One way secure encryption
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    // Hash value as a hexadecimal
    return hash.digest("hex");
  };
}
