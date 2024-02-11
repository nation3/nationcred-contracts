import { expect } from "chai";
import { ethers } from "hardhat";

describe("DiscourseUsernames", function () {
  it("Deploy contract", async function () {
    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy();
    await discourseUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await discourseUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy();
    await discourseUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourseUsernames.updateUsername("User");
    const usernameAfterUpdate = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User");
  });

  it("updateUsername - with spaces", async function () {
    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy();
    await discourseUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourseUsernames.updateUsername("User Name");
    const usernameAfterUpdate = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name");
  });

  it("updateUsername - with UTF-8 characters", async function () {
    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy();
    await discourseUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourseUsernames.updateUsername("User Name ☁🇺🇳");
    const usernameAfterUpdate = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name ☁🇺🇳");
  });

  it("deleteUsername", async function () {
    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy();
    await discourseUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discourseUsernames.updateUsername("User #123");
    const usernameAfterUpdate = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User #123");

    await discourseUsernames.deleteUsername();
    const usernameAfterDeletion = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterDeletion:", usernameAfterDeletion);
    expect(usernameAfterDeletion).to.equal("");
  });
});
