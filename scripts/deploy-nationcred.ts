import { verifyContract, deployContract } from "./helpers"

async function main() {
  const contractName = "NationCred";
  const contractPath = "contracts/NationCred.sol:NationCred"

  // Constructor Args
  const passportAddress = "0x11f30642277A70Dab74C6fAF4170a8b340BE2f98"; // Sepolia
  // const passportAddress = "0x3337dac9F251d4E403D6030E18e3cfB6a2cb1333"; // Mainnet

  const args = [passportAddress];
  const contractAddress = await deployContract(contractName, args);
  await verifyContract(contractPath, contractAddress, args);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
