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
  public nonce = Math.round(Math.random() * 0xffffffff);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    // To order blocks in order
    private timestamp = Date.now()
  ) {}

  get hash() {
    const str = JSON.stringify(this);
    // One way secure encryption
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    // Hash value as a hexadecimal
    return hash.digest("hex");
  }
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

  addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    const verify = crypto.createVerify("SHA256");
    verify.update(transaction.toString());
    // Verify transaction using signature and public key
    const isValid = verify.verify(senderPublicKey, signature);
    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    } else {
      console.error("Invalid signature");
    }
  }

  // Proof of work
  mine(nonce: number) {
    let solution = 1;
    console.log("Mining...");
    // Brute force the nonce
    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((nonce + solution).toString()).end();
      const attempt = hash.digest("hex");
      if (attempt.substr(0, 4) === "0000") {
        console.log("Found a solution!");
        return solution;
      }
      solution++;
    }
  }
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
    const sign = crypto.createSign("SHA256");
    sign.update(transaction.toString()).end();
    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  };
}

// Usage Example Testing
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const wallet3 = new Wallet();

wallet1.sendMoney(10, wallet2.publicKey);
wallet2.sendMoney(20, wallet3.publicKey);
wallet3.sendMoney(30, wallet1.publicKey);

console.log(Chain.instance);
