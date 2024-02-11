import { expect } from "chai";
import { ethers } from "hardhat";

describe("Discourse", function () {
  it("Deploy contract", async function () {
    const Discourse = await ethers.getContractFactory("Discourse");
    const discourse = await Discourse.deploy();
    await discourse.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await discourse.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const Discourse = await ethers.getContractFactory("Discourse");
    const discourse = await Discourse.deploy();
    await discourse.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourse.updateUsername("User");
    const usernameAfterUpdate = await discourse.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User");
  });

  it("updateUsername - with spaces", async function () {
    const Discourse = await ethers.getContractFactory("Discourse");
    const discourse = await Discourse.deploy();
    await discourse.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourse.updateUsername("User Name");
    const usernameAfterUpdate = await discourse.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name");
  });

  it("updateUsername - with UTF-8 characters", async function () {
    const Discourse = await ethers.getContractFactory("Discourse");
    const discourse = await Discourse.deploy();
    await discourse.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourse.updateUsername("User Name ☁🇺🇳");
    const usernameAfterUpdate = await discourse.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name ☁🇺🇳");
  });

  it("deleteUsername", async function () {
    const Discourse = await ethers.getContractFactory("Discourse");
    const discourse = await Discourse.deploy();
    await discourse.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourse.updateUsername("User #123");
    const usernameAfterUpdate = await discourse.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User #123");

    await discourse.deleteUsername();
    const usernameAfterDeletion = await discourse.usernames(owner.address);
    console.log("usernameAfterDeletion:", usernameAfterDeletion);
    expect(usernameAfterDeletion).to.equal("");
  });
});
