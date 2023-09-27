import { expect } from "chai";
import { ethers } from "hardhat";

describe("GitHub", function () {
  it("Deploy contract", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const veTokenAddress = "0xF7deF1D2FBDA6B74beE7452fdf7894Da9201065d";
    const gitHub = await GitHub.deploy(veTokenAddress);
    await gitHub.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);
    
    const username = await gitHub.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const veTokenAddress = "0xF7deF1D2FBDA6B74beE7452fdf7894Da9201065d";
    const gitHub = await GitHub.deploy(veTokenAddress);
    await gitHub.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await gitHub.updateUsername("test");

    const usernameAfterUpdate = await gitHub.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("test");
  });
});
