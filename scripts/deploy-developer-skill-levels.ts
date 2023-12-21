// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DeveloperSkillLevels = await ethers.getContractFactory("DeveloperSkillLevels");
  // const passportUtilsAddress = "0xdBBCE0e796d10C95D23b4AAfCD19DEf268502A5b"; // Goerli
  const passportUtilsAddress = "0x4Db31016fe58292B7654C9EDF8Ad106761BB7a90"; // Sepolia
  // const passportUtilsAddress = "0x..."; // Mainnet
  const easAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia - https://github.com/ethereum-attestation-service/eas-contracts/tree/master?tab=readme-ov-file#sepolia
  const easSchemaUID = "0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b"; // Sepolia - https://sepolia.easscan.org/schema/view/0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b
  const developerSkillLevels = await DeveloperSkillLevels.deploy(passportUtilsAddress, easAddress, easSchemaUID);

  await developerSkillLevels.deployed();

  console.log("DeveloperSkillLevels deployed to:", developerSkillLevels.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
