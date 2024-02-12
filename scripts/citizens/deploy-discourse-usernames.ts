import { verifyContract, deployContract } from "../helpers"


async function main() {
  const contractName = "DiscourseUsernames";
  const contractPath = "contracts/citizens/DiscourseUsernames.sol:DiscourseUsernames"

  // Constructor Args
  const passportUtilsAddress = "0x4C72e8f37a2652BA6eEE956Ab30Ff21C3514cb5a"; // Sepolia

  const args = [passportUtilsAddress];
  const contractAddress = await deployContract(contractName, args);
  await verifyContract(contractPath, contractAddress, args);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
