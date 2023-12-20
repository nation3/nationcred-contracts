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
  const GitHubUsernames = await ethers.getContractFactory("GitHubUsernames");
  // const passportUtilsAddress = "0xdBBCE0e796d10C95D23b4AAfCD19DEf268502A5b"; // Goerli
  const passportUtilsAddress = "0x4Db31016fe58292B7654C9EDF8Ad106761BB7a90"; // Sepolia
  // const passportUtilsAddress = "0x..."; // Mainnet
  const githubUsernames = await GitHubUsernames.deploy(passportUtilsAddress);

  await githubUsernames.deployed();

  console.log("GitHubUsernames deployed to:", githubUsernames.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
