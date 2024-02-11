import { ethers, run } from "hardhat";

async function deployContract(name: string, args: Array<any>): Promise<string> {
  const contractFactory = await ethers.getContractFactory(name);

  const contract = await contractFactory.deploy(...args);
  await contract.deployed();
  return contract.address;
}

async function verifyContract(contractPath: string, contractAddress: string, args: Array<any>) {
  await run("verify:verify", {
    contract: contractPath,
    address: contractAddress,
    constructorArguments: args,
  });
}

async function main() {
  const contractName = "PassportUtils";
  const contractPath = "contracts/utils/PassportUtils.sol:PassportUtils"

  // Constructor Args
  const passportIssuerAddress = "0xdad32e13E73ce4155a181cA0D350Fee0f2596940"; // Sepolia
  const votingEscrowAddress = "0x8100e77899C24b0F7B516153F84868f850C034BF"; // Sepolia

  const args = [passportIssuerAddress, votingEscrowAddress];

  console.log('Contract is deploying....');
  const contractAddress = await deployContract(contractName, args);
  console.log(`${contractName} deployed to: ${contractAddress}`);

  console.log('Waiting for 30 seconds before verifying...');
  await sleep(30_000);
  
  console.log('Contract is verifying....');
  await verifyContract(contractPath, contractAddress, args);
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
