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
  const PassportUtils = await ethers.getContractFactory("PassportUtils");
  // const passportIssuerAddress = "0x8c16926819AB30B8b29A8E23F5C230d164337093"; // Goerli
  const passportIssuerAddress = "0xdad32e13E73ce4155a181cA0D350Fee0f2596940"; // Sepolia
  // const votingEscrowAddress = "0xF7deF1D2FBDA6B74beE7452fdf7894Da9201065d"; // Goerli
  const votingEscrowAddress = "0x8100e77899C24b0F7B516153F84868f850C034BF"; // Sepolia
  const passportUtils = await PassportUtils.deploy(
    passportIssuerAddress,
    votingEscrowAddress
  );

  await passportUtils.deployed();

  console.log("PassportUtils deployed to:", passportUtils.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
