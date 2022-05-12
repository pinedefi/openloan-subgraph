// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Loan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Loan entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Loan entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Loan", id.toString(), this);
  }

  static load(id: string): Loan | null {
    return store.get("Loan", id) as Loan | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanStartBlock(): BigInt | null {
    let value = this.get("loanStartBlock");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set loanStartBlock(value: BigInt | null) {
    if (value === null) {
      this.unset("loanStartBlock");
    } else {
      this.set("loanStartBlock", Value.fromBigInt(value as BigInt));
    }
  }

  get loanExpiretimestamp(): BigInt | null {
    let value = this.get("loanExpiretimestamp");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set loanExpiretimestamp(value: BigInt | null) {
    if (value === null) {
      this.unset("loanExpiretimestamp");
    } else {
      this.set("loanExpiretimestamp", Value.fromBigInt(value as BigInt));
    }
  }

  get interestBPS1000000XBlock(): BigInt | null {
    let value = this.get("interestBPS1000000XBlock");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set interestBPS1000000XBlock(value: BigInt | null) {
    if (value === null) {
      this.unset("interestBPS1000000XBlock");
    } else {
      this.set("interestBPS1000000XBlock", Value.fromBigInt(value as BigInt));
    }
  }

  get maxLTVBPS(): BigInt | null {
    let value = this.get("maxLTVBPS");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set maxLTVBPS(value: BigInt | null) {
    if (value === null) {
      this.unset("maxLTVBPS");
    } else {
      this.set("maxLTVBPS", Value.fromBigInt(value as BigInt));
    }
  }

  get borrowedWei(): BigInt | null {
    let value = this.get("borrowedWei");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set borrowedWei(value: BigInt | null) {
    if (value === null) {
      this.unset("borrowedWei");
    } else {
      this.set("borrowedWei", Value.fromBigInt(value as BigInt));
    }
  }

  get returnedWei(): BigInt | null {
    let value = this.get("returnedWei");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set returnedWei(value: BigInt | null) {
    if (value === null) {
      this.unset("returnedWei");
    } else {
      this.set("returnedWei", Value.fromBigInt(value as BigInt));
    }
  }

  get accuredInterestWei(): BigInt | null {
    let value = this.get("accuredInterestWei");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set accuredInterestWei(value: BigInt | null) {
    if (value === null) {
      this.unset("accuredInterestWei");
    } else {
      this.set("accuredInterestWei", Value.fromBigInt(value as BigInt));
    }
  }

  get repaidInterestWei(): BigInt | null {
    let value = this.get("repaidInterestWei");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set repaidInterestWei(value: BigInt | null) {
    if (value === null) {
      this.unset("repaidInterestWei");
    } else {
      this.set("repaidInterestWei", Value.fromBigInt(value as BigInt));
    }
  }

  get borrower(): Bytes | null {
    let value = this.get("borrower");
    if (value === null) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set borrower(value: Bytes | null) {
    if (value === null) {
      this.unset("borrower");
    } else {
      this.set("borrower", Value.fromBytes(value as Bytes));
    }
  }

  get pool(): Bytes | null {
    let value = this.get("pool");
    if (value === null) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set pool(value: Bytes | null) {
    if (value === null) {
      this.unset("pool");
    } else {
      this.set("pool", Value.fromBytes(value as Bytes));
    }
  }

  get erc721(): Bytes | null {
    let value = this.get("erc721");
    if (value === null) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set erc721(value: Bytes | null) {
    if (value === null) {
      this.unset("erc721");
    } else {
      this.set("erc721", Value.fromBytes(value as Bytes));
    }
  }
}
