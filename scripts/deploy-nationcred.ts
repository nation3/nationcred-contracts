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
  const contractName = "NationCred";
  const contractPath = "contracts/NationCred.sol:NationCred"

  // Constructor Args
  const passportAddress = "0x11f30642277A70Dab74C6fAF4170a8b340BE2f98"; // Sepolia
  // const passportAddress = "0x3337dac9F251d4E403D6030E18e3cfB6a2cb1333"; // Mainnet

  const args = [passportAddress];

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
