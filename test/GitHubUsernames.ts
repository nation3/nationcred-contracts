import { expect } from "chai";
import { ethers } from "hardhat";

describe("GitHubUsernames", function () {
  it("Deploy contract", async function () {
    const GitHubUsernames = await ethers.getContractFactory("GitHubUsernames");
    const passportUtilsAddress = ethers.constants.AddressZero;
    const githubUsernames = await GitHubUsernames.deploy(passportUtilsAddress);
    await githubUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await githubUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const GitHubUsernames = await ethers.getContractFactory("GitHubUsernames");
    const passportUtilsAddress = ethers.constants.AddressZero;
    const githubUsernames = await GitHubUsernames.deploy(passportUtilsAddress);
    await githubUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    // await githubUsernames.updateUsername("test");
    await expect(githubUsernames.updateUsername("test")).to.be.reverted;

    const usernameAfterUpdate = await githubUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    // expect(usernameAfterUpdate).to.equal("test");
    expect(usernameAfterUpdate).to.equal("");
  });
});
