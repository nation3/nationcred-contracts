import { verifyContract, deployContract } from "../helpers"
import hre from "hardhat"

async function main() {
  const contractName = "PassportUtils";
  const contractPath = "contracts/utils/PassportUtils.sol:PassportUtils"

  // Load deployment configurations
  const networkName = hre.network.name;
  console.log('networkName:', networkName);
  const deploymentsFilename = (networkName == "mainnet") ? "mainnet.json" : "sepolia.json";

  const deploymentsFoundationsResponse = await fetch(`https://raw.githubusercontent.com/nation3/foundations/main/deployments/${deploymentsFilename}`);
  const deploymentsFoundations = JSON.parse(await deploymentsFoundationsResponse.text());
  console.log("deploymentsFoundations:", deploymentsFoundations);

  // Constructor Args
  const passportIssuerAddress = deploymentsFoundations["nationPassportNFTIssuer"];
  const votingEscrowAddress = deploymentsFoundations["veNationToken"];
  
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
