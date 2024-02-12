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
  const contractName = "DiscordUsernames";
  const contractPath = "contracts/citizens/DiscordUsernames.sol:DiscordUsernames"

  // Constructor Args
  const passportUtilsAddress = "0x4C72e8f37a2652BA6eEE956Ab30Ff21C3514cb5a"; // Sepolia

  const args = [passportUtilsAddress];

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