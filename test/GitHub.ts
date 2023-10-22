import { expect } from "chai";
import { ethers } from "hardhat";

describe("GitHub", function () {
  it("Deploy contract", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const passportUtilsAddress = ethers.constants.AddressZero;
    const gitHub = await GitHub.deploy(passportUtilsAddress);
    await gitHub.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await gitHub.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const passportUtilsAddress = ethers.constants.AddressZero;
    const gitHub = await GitHub.deploy(passportUtilsAddress);
    await gitHub.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    // await gitHub.updateUsername("test");
    await expect(gitHub.updateUsername("test")).to.be.reverted;

    const usernameAfterUpdate = await gitHub.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    // expect(usernameAfterUpdate).to.equal("test");
    expect(usernameAfterUpdate).to.equal("");
  });
});
