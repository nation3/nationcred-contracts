import { verifyContract, deployContract } from "../helpers"
import hre from "hardhat"

async function main() {
  const contractName = "DevGuildRewardsDistributor";
  const contractPath = "contracts/rewards/DevGuildRewardsDistributor.sol:DevGuildRewardsDistributor"

  // Load deployment configurations
  const networkName = hre.network.name;
  console.log('networkName:', networkName);
  const deploymentsFilename = (networkName == "mainnet") ? "mainnet.json" : "sepolia.json";
  console.log('deploymentsFilename:', deploymentsFilename);
  
  const deploymentsNationCred = require(`../../deployments/${deploymentsFilename}`);
  console.log("deploymentsNationCred:", deploymentsNationCred);
  
  const deploymentsFoundationsResponse = await fetch(`https://raw.githubusercontent.com/nation3/foundations/main/deployments/${deploymentsFilename}`);
  const deploymentsFoundations = JSON.parse(await deploymentsFoundationsResponse.text());
  console.log("deploymentsFoundations:", deploymentsFoundations);

  // Constructor Args
  const passportUtilsAddress = deploymentsNationCred["utils/PassportUtils.sol"];
  const rewardTokenAddress = deploymentsFoundations["nationToken"];
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
