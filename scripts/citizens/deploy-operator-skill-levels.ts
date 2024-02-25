import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "OperatorSkillLevels";
  const contractPath = "contracts/citizens/OperatorSkillLevels.sol:OperatorSkillLevels"

  // Constructor Args
  const passportUtilsAddress = "0x68ADa619A2b806A2bEc8e3789FfBA206641c22ff"; // Sepolia

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
