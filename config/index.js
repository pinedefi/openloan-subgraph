import { create, globSource } from "ipfs-http-client";
const ipfs = create({ url: "https://api.thegraph.com/ipfs/api/v0/" });

console.log("\n\n");
console.log(
  "\x1b[34m%s\x1b[0m",
  "~~~~~~~~~~~~ File pinning progress ~~~~~~~~~~~~"
);
console.log("\n\n");

async function main () {
  try {
    for await (const file of ipfs.addAll(
      globSource('./config', "*.json")
    )) {
      console.log(file)
    };
  } catch (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `pin file error ---- ${error.message}`
    );
  }
  console.log("\n");
}

main();