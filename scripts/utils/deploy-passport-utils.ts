import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "PassportUtils";
  const contractPath = "contracts/utils/PassportUtils.sol:PassportUtils"

  // Constructor Args
  const passportIssuerAddress = "0xdad32e13E73ce4155a181cA0D350Fee0f2596940"; // Sepolia
  const votingEscrowAddress = "0x8100e77899C24b0F7B516153F84868f850C034BF"; // Sepolia

  const args = [passportIssuerAddress, votingEscrowAddress];
  const contractAddress = await deployContract(contractName, args);
  await verifyContract(contractPath, contractAddress, args);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
