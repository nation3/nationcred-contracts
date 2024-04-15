import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "OpsGuildRewardsDistributor";
  const contractPath = "contracts/rewards/OpsGuildRewardsDistributor.sol:OpsGuildRewardsDistributor"

  // Constructor Args
  // const passportUtilsAddress = "0x88Ea3A3618A988783E39C2CadFdd77Dc07895b59"; // Sepolia
  // const rewardTokenAddress = "0x23Ca3002706b71a440860E3cf8ff64679A00C9d7"; // Sepolia
  const passportUtilsAddress = "0x23Ca3002706b71a440860E3cf8ff64679A00C9d7"; // Mainnet
  const rewardTokenAddress = "0x333A4823466879eeF910A04D473505da62142069"; // Mainnet
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
