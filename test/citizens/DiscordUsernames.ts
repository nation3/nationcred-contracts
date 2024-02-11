import { expect } from "chai";
import { ethers } from "hardhat";

describe("DiscordUsernames", function () {
  it("Deploy contract", async function () {
    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy();
    await discordUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    const username = await discordUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername", async function () {
    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy();
    await discordUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discordUsernames.updateUsername("User");
    const usernameAfterUpdate = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User");
  });

  it("updateUsername - with spaces", async function () {
    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy();
    await discordUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discordUsernames.updateUsername("User Name");
    const usernameAfterUpdate = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name");
  });

  it("updateUsername - with UTF-8 characters", async function () {
    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy();
    await discordUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discordUsernames.updateUsername("User Name ☁🇺🇳");
    const usernameAfterUpdate = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User Name ☁🇺🇳");
  });

  it("deleteUsername", async function () {
    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy();
    await discordUsernames.deployed();

    const [owner] = await ethers.getSigners();
    console.log("owner.address:", owner.address);

    await discordUsernames.updateUsername("User #123");
    const usernameAfterUpdate = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("User #123");

    await discordUsernames.deleteUsername();
    const usernameAfterDeletion = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterDeletion:", usernameAfterDeletion);
    expect(usernameAfterDeletion).to.equal("");
  });
});
