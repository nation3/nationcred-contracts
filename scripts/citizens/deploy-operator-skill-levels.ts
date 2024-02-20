import { verifyContract, deployContract } from "../helpers"

async function main() {
  const contractName = "OperatorSkillLevels";
  const contractPath = "contracts/citizens/OperatorSkillLevels.sol:OperatorSkillLevels"

  // Constructor Args
  const passportUtilsAddress = "0x4C72e8f37a2652BA6eEE956Ab30Ff21C3514cb5a"; // Sepolia
  const easAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia - https://github.com/ethereum-attestation-service/eas-contracts/tree/master?tab=readme-ov-file#sepolia
  const easSchemaUID = "0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b"; // Sepolia - https://sepolia.easscan.org/schema/view/0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b

  const args = [passportUtilsAddress, easAddress, easSchemaUID];

  const contractAddress = await deployContract(contractName, args);
  await verifyContract(contractPath, contractAddress, args);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
