import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  LoanInitiated,
  LoanTermsChanged
} from "../generated/ERC721LendingPoolETH01/ERC721LendingPoolETH01";
import { Loan, Pool } from "../generated/schema";
import {
  LiquidateNFTCall
} from "../generated/ControlPlane01-00/ControlPlane01"
import { ERC721LendingPoolETH01 } from "../generated/ControlPlane01-01/ERC721LendingPoolETH01";

export function handleLoanInitiated(event: LoanInitiated): void {
  let loan = Loan.load(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  if (loan == null) {
    loan = new Loan(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  }
  if (event.params.loan.borrowedWei > event.params.loan.returnedWei) {
    loan.loanStartBlock = event.params.loan.loanStartBlock;
    loan.loanExpiretimestamp = event.params.loan.loanExpireTimestamp;
    loan.interestBPS1000000XBlock = event.params.loan.interestBPS1000000XBlock;
    loan.maxLTVBPS = event.params.loan.maxLTVBPS;
    loan.borrowedWei = event.params.loan.borrowedWei;
    loan.returnedWei = event.params.loan.returnedWei;
    loan.accuredInterestWei = event.params.loan.accuredInterestWei;
    loan.repaidInterestWei = event.params.loan.repaidInterestWei;
    loan.borrower = event.params.loan.borrower;
    loan.pool = event.address;
    loan.erc721 = event.params.erc721;
    loan.save();
  } else {
    if (loan != null) {
      store.remove("Loan", loan.id);
    }
  }

  let pool = Pool.load(event.address.toHexString());
  if (pool == null) {
    pool = new Pool(event.address.toHexString());
    pool.totalUtilization = BigInt.fromI32(0);
  }

  pool.totalUtilization = pool.totalUtilization.plus(event.params.loan.borrowedWei);
  pool.collection = event.params.erc721;
  pool.save();
}

export function handleLoanTermsChanged(event: LoanTermsChanged): void {
  let loan = Loan.load(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  if (loan == null) {
    loan = new Loan(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  }
  loan.loanStartBlock = event.params.newTerms.loanStartBlock;
  loan.loanExpiretimestamp = event.params.newTerms.loanExpireTimestamp;
  loan.interestBPS1000000XBlock =
    event.params.newTerms.interestBPS1000000XBlock;
  loan.maxLTVBPS = event.params.newTerms.maxLTVBPS;
  loan.borrowedWei = event.params.newTerms.borrowedWei;
  loan.returnedWei = event.params.newTerms.returnedWei;
  loan.accuredInterestWei = event.params.newTerms.accuredInterestWei;
  loan.repaidInterestWei = event.params.newTerms.repaidInterestWei;
  loan.borrower = event.params.newTerms.borrower;
  loan.pool = event.address;
  loan.save();

  let pool = Pool.load(event.address.toHexString());
  if (pool == null) {
    pool = new Pool(event.address.toHexString());
    pool.totalUtilization = BigInt.fromI32(0);
  }

  if (event.params.newTerms.borrowedWei <= event.params.newTerms.returnedWei) {
    pool.totalUtilization = pool.totalUtilization.minus(event.params.oldTerms.borrowedWei.minus(event.params.oldTerms.returnedWei));
    pool.collection = event.params.erc721;
    pool.save()
    store.remove("Loan", loan.id);
  } else {
    pool.totalUtilization = pool.totalUtilization.minus(event.params.newTerms.returnedWei.minus(event.params.oldTerms.returnedWei));
    pool.collection = event.params.erc721;
    pool.save();
  }
}

export function handleLiquidation(call: LiquidateNFTCall): void {
  let contract = ERC721LendingPoolETH01.bind(call.inputs.target)
  let collectionAddress = contract._supportedCollection()
  let loan = Loan.load(collectionAddress.toHexString() + '/' + call.inputs.loanID.toString());
  let pool = Pool.load(call.inputs.target.toHexString());
  pool.totalUtilization = pool.totalUtilization.minus(loan.borrowedWei.minus(loan.returnedWei as BigInt))
  pool.save()
  store.remove("Loan", loan.id);
}