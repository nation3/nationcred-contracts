import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "DevGuildRewardsDistributor";
  const contractPath = "contracts/rewards/DevGuildRewardsDistributor.sol:DevGuildRewardsDistributor"

  // Constructor Args
  const passportUtilsAddress = "0x68ADa619A2b806A2bEc8e3789FfBA206641c22ff"; // Sepolia
  const rewardTokenAddress = "0x23Ca3002706b71a440860E3cf8ff64679A00C9d7"; // Sepolia
  const CLIFF_VESTING_DATE = 1735689600; // 2025-01-01

  const args = [passportUtilsAddress, rewardTokenAddress, CLIFF_VESTING_DATE];
  const contractAddress = await deployContract(contractName, args);
  await verifyContract(contractPath, contractAddress, args);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
