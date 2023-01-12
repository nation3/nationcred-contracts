import { expect } from "chai";
import { ethers } from "hardhat";

describe("Discord", function () {
  it("Deploy contract", async function () {
    const Discord = await ethers.getContractFactory("Discord");
    const discord = await Discord.deploy();
    await discord.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await discord.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const Discord = await ethers.getContractFactory("Discord");
    const discord = await Discord.deploy();
    await discord.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discord.updateUsername("User");

    const usernameAfterUpdate = await discord.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User");
  });

  it("updateUsername - with spaces", async function () {
    const Discord = await ethers.getContractFactory("Discord");
    const discord = await Discord.deploy();
    await discord.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discord.updateUsername("User Name");

    const usernameAfterUpdate = await discord.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name");
  });

  it("updateUsername - with UTF-8 characters", async function () {
    const Discord = await ethers.getContractFactory("Discord");
    const discord = await Discord.deploy();
    await discord.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discord.updateUsername("User Name ☁🇺🇳");

    const usernameAfterUpdate = await discord.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name ☁🇺🇳");
  });
});
