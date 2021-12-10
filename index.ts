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

class Chain {
  // To create a singleton instance
  public static instance = new Chain();
  chain: Block[];

  constructor() {
    // Creating the genesis block
    this.chain = [new Block("", new Transaction(100, "genesis", "kalash"))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock = (
    transaction: Transaction,
    senderPublicKey: string,
    signature: string
  ) => {
    this.chain.push(new Block(this.lastBlock.prevHash, transaction));
  };
}

class Wallet {
  // To recieve money
  public publicKey: string;
  // To spend money
  public privateKey: string;

  constructor() {
    // rsa - Full encryption algorithm
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney = (amount: number, payeePublicKey: string) => {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
  };
}
