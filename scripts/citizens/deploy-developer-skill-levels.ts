import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "DeveloperSkillLevels";
  const contractPath = "contracts/citizens/DeveloperSkillLevels.sol:DeveloperSkillLevels"

  // Constructor Args
  // const passportUtilsAddress = "0x88Ea3A3618A988783E39C2CadFdd77Dc07895b59"; // Sepolia
  const passportUtilsAddress = "0x23Ca3002706b71a440860E3cf8ff64679A00C9d7"; // Mainnet

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
