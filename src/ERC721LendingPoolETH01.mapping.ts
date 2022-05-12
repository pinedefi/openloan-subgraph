import { store } from "@graphprotocol/graph-ts";
import {
  LoanInitiated,
  LoanTermsChanged,
} from "../generated/ERC721LendingPoolETH01/ERC721LendingPoolETH01";
import { Loan } from "../generated/schema";

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
    loan.erc721 = event.params.erc721
    loan.save();
  } else {
    if (loan != null) {
      store.remove("Loan", loan.id);
    }
  }
}

export function handleLoanTermsChanged(event: LoanTermsChanged): void {
  let loan = Loan.load(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  if (loan == null) {
    loan = new Loan(event.params.erc721.toHexString() + '/' + event.params.nftID.toString());
  }
  // if (event.params.newTerms.borrowedWei > event.params.newTerms.returnedWei) {
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
  // }
  //  else {
    if (event.params.newTerms.borrowedWei <= event.params.newTerms.returnedWei) {
      store.remove("Loan", loan.id);
    }
  // }
}
