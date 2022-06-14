import { BigDecimal, BigInt, Bytes, ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts";
import { Cloned } from "../generated/CloneFactory/CloneFactory";
import { ERC721LendingPoolETH01 as PoolContract } from "../generated/ERC721LendingPoolETH01/ERC721LendingPoolETH01";
import { Collection, Pool } from "../generated/schema";

const cid = 'QmUgzToM4msftpwefdwBFxbye7bb5BxFEZSYsWSjX6C9tg';

export function handleCloned(event: Cloned): void {
  // const address = event.params.target;
  const address = event.params.result;

  let bytes = ipfs.cat(cid);
  if (bytes) {
    let data = json.try_fromBytes(bytes as Bytes);
    if (data.isOk) {
      if (data.value.kind == JSONValueKind.ARRAY) {
        let collections = data.value.toArray();
        for (let i = 0; i < collections.length; i ++) {
          const collection = collections[i];
          if(collection.kind == JSONValueKind.OBJECT) {
            const collectionData = collection.toObject();
            if (collectionData) {
              const collectionDataAddress = collectionData.get("address");
              const collectionDataId = collectionData.get("id");
              if (collectionDataAddress && collectionDataAddress.kind == JSONValueKind.STRING) {
                if(collectionDataId && collectionDataId.kind == JSONValueKind.STRING) {
                  const collectionId = collectionDataId.toString();
                  let collection = Collection.load(collectionId);
                  const poolContract = PoolContract.bind(address);
    
                  if (!collection) {
                    collection = new Collection(collectionId);
                    collection.address = poolContract._supportedCollection();
                    const collectionDataDisplayName = collectionData.get("display_name");
                    if (collectionDataDisplayName) {
                      collection.name = collectionDataDisplayName.toString();
                    }
                    
                    const collectionDataImage = collectionData.get("image_url");
                    if (collectionDataImage) {
                      collection.image = collectionDataImage.toString();
                    }

                    const pools = new Array<string>();
                    const collectionDataLendingPools = collectionData.get("lendingPools");
                    let maxLtv = new BigDecimal(BigInt.fromI32(0));
                    let lowestAPROverride = new BigDecimal(BigInt.fromI32(65535));
                    let lowestAPRStandard = new BigDecimal(BigInt.fromI32(65535));
                    if (collectionDataLendingPools && collectionDataLendingPools.kind == JSONValueKind.ARRAY) {
                      const lendingPools = collectionDataLendingPools.toArray();
                      for (let j = 0; j < lendingPools.length; j += 1) {
                        const pool = lendingPools[j].toObject();
                        const poolAddress = pool.get("address");
                        if (poolAddress) {
                          let poolSchema = Pool.load(poolAddress.toString());
                          if (!poolSchema) {
                            poolSchema = new Pool(poolAddress.toString());
                            poolSchema.totalUtilization = BigInt.fromI32(0);
                            poolSchema.collection = collection.id;
                            const poolLoanOptions = pool.get("loan_options");
                            if (poolLoanOptions) {
                              const loanOptions = poolLoanOptions.toArray();
                              for (let k = 0; k < loanOptions.length; k ++) {
                                const loanOption = loanOptions[k].toObject();
                                
                                let loanOptionDurationBlock = loanOption.get("loan_duration_block");
                                if (loanOptionDurationBlock && loanOptionDurationBlock.kind == JSONValueKind.STRING) {
                                  poolSchema.loanDurationBlock = BigDecimal.fromString(loanOptionDurationBlock.toString());
                                }
  
                                let loanOptionDurationSecond = loanOption.get("loan_duration_second");
                                if (loanOptionDurationSecond && loanOptionDurationSecond.kind == JSONValueKind.STRING) {
                                  poolSchema.loanDurationSecond = BigDecimal.fromString(loanOptionDurationSecond.toString());
                                }
  
                                let loanOptionBpsBlock = loanOption.get("interest_bps_block");
                                if (loanOptionBpsBlock && loanOptionBpsBlock.kind == JSONValueKind.STRING) {
                                  poolSchema.interestBpsBlock = BigDecimal.fromString(loanOptionBpsBlock.toString());
                                  let interestBpsBlock = poolSchema.interestBpsBlock;
                                  if (interestBpsBlock) {
                                    if (interestBpsBlock.lt(lowestAPRStandard))
                                      lowestAPRStandard = interestBpsBlock;
                                  }
                                }
  
                                let loanOptionBpsBlockOverride = loanOption.get("interest_bps_block_override");
                                if (loanOptionBpsBlockOverride && loanOptionBpsBlockOverride.kind == JSONValueKind.STRING) {
                                  poolSchema.interestBpsBlockOverride = BigDecimal.fromString(loanOptionBpsBlockOverride.toString());
                                  let interestBpsBlockOverride = poolSchema.interestBpsBlockOverride;
                                  if (interestBpsBlockOverride) {
                                    if (interestBpsBlockOverride.lt(lowestAPROverride))
                                      lowestAPROverride = interestBpsBlockOverride;
                                  }
                                }
  
                                let loanOptionMaxLtvBps = loanOption.get("max_ltv_bps");
                                if (loanOptionMaxLtvBps && loanOptionMaxLtvBps.kind == JSONValueKind.STRING) {
                                  poolSchema.maxLtvBps = BigDecimal.fromString(loanOptionMaxLtvBps.toString());
                                  let maxLtvBps = poolSchema.maxLtvBps;
                                  if (maxLtvBps) {
                                    if (maxLtvBps.gt(maxLtv)) maxLtv = maxLtvBps;
                                  }
                                }
                              }
                              poolSchema.save();
                            }
                          }
                          pools.push(poolSchema.id);
                        }
                      }
                    }
                    collection.pools = pools;
                    collection.maxLtv = maxLtv;
                    if (lowestAPRStandard.notEqual(new BigDecimal(BigInt.fromI32(65535)))) {
                      lowestAPRStandard = lowestAPRStandard.div(new BigDecimal(BigInt.fromI32(140000))).times(new BigDecimal(BigInt.fromI32(60 * 60 * 24 * 365)));

                    } else {
                      lowestAPRStandard = new BigDecimal(BigInt.fromI32(0));

                    }
                    if (lowestAPROverride.notEqual(new BigDecimal(BigInt.fromI32(65535)))) {
                      lowestAPROverride = lowestAPROverride.div(new BigDecimal(BigInt.fromI32(140000))).times(new BigDecimal(BigInt.fromI32(60 * 60 * 24 * 365)));

                    } else {
                      lowestAPROverride = new BigDecimal(BigInt.fromI32(0));

                    }
                    collection.lowestAPRStandard = lowestAPRStandard;
                    collection.lowestAPROverride = lowestAPROverride;
                    collection.save();
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}