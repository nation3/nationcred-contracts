import { expect } from "chai";
import { ethers } from "hardhat";

describe("GitHub", function () {
  it("Deploy contract", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const gitHub = await GitHub.deploy();
    await gitHub.deployed();

    const username = await gitHub.usernames(
      "0x4e3072f7b5C075EA5FdEb423DA95312C4B99dc22"
    );
    console.log("username:", username);
    expect(username).to.equal("aahna-ashina");
  });

  it("updateUsername", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const gitHub = await GitHub.deploy();
    await gitHub.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await gitHub.updateUsername("test");

    const usernameAfterUpdate = await gitHub.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("test");
  });
});
