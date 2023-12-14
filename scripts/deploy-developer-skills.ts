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
  const passportUtilsAddress = "0xdBBCE0e796d10C95D23b4AAfCD19DEf268502A5b";
  const developerSkillLevels = await DeveloperSkillLevels.deploy(passportUtilsAddress);

  await developerSkillLevels.deployed();

  console.log("DeveloperSkillLevels deployed to:", developerSkillLevels.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
