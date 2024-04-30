import { verifyContract, deployContract } from "../helpers"
import hre from "hardhat"

async function main() {
  const contractName = "MarketeerSkillLevels";
  const contractPath = "contracts/citizens/MarketeerSkillLevels.sol:MarketeerSkillLevels"

  // Load deployment configurations
  const networkName = hre.network.name;
  console.log('networkName:', networkName);
  const deploymentsFilename = (networkName == "mainnet") ? "mainnet.json" : "sepolia.json";
  console.log('deploymentsFilename:', deploymentsFilename);
  
  const deploymentsNationCred = require(`../../deployments/${deploymentsFilename}`);
  console.log("deploymentsNationCred:", deploymentsNationCred);

  // Constructor Args
  const passportUtilsAddress = deploymentsNationCred["utils/PassportUtils.sol"];

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
