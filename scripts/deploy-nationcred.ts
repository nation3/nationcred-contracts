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
  const NationCred = await ethers.getContractFactory("NationCred");
  // const passportAddress = "0x51f728c58697aff9582cfde3cbd00ec83e9ae7fc"; // Goerli
  const passportAddress = "0x11f30642277A70Dab74C6fAF4170a8b340BE2f98"; // Sepolia
  // const passportAddress = "0x3337dac9F251d4E403D6030E18e3cfB6a2cb1333"; // Mainnet
  const nationCred = await NationCred.deploy(passportAddress);

  await nationCred.deployed();

  console.log("NationCred deployed to:", nationCred.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
