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
  const contractName = "Discord";
  const contractPath = "contracts/Discord.sol:Discord"

  console.log('Contract is deploying....');
  const contractAddress = await deployContract(contractName, []);
  console.log(`${contractName} deployed to: ${contractAddress}`);
  console.log('Contract is verifying....');
  await verifyContract(contractPath, contractAddress, []);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
