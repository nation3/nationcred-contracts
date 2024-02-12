import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("DiscordUsernames", function () {
  async function deploymentFixture() {
    console.log("deploymentFixture");

    const [owner, otherAccount] = await ethers.getSigners();

    const PassportIssuer = await ethers.getContractFactory(
      "PassportIssuerMock"
    );
    const passportIssuer = await PassportIssuer.deploy();

    const VotingEscrow = await ethers.getContractFactory("VotingEscrowMock");
    const votingEscrow = await VotingEscrow.deploy();

    const PassportUtils = await ethers.getContractFactory("PassportUtils");
    const passportUtils = await PassportUtils.deploy(
      passportIssuer.address,
      votingEscrow.address
    );

    const DiscordUsernames = await ethers.getContractFactory("DiscordUsernames");
    const discordUsernames = await DiscordUsernames.deploy(passportUtils.address);
    await discordUsernames.deployed();

    return { owner, otherAccount, discordUsernames, passportIssuer };
  }

  it("usernames empty", async function () {
    const { owner, discordUsernames } = await loadFixture(deploymentFixture);

    const username = await discordUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername - citizen with valid passport", async function () {
    const { owner, discordUsernames, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.claim();

    const tx = await discordUsernames.updateUsername("New Username");
    console.log("tx:", tx);

    const usernameAfterUpdate = await discordUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("New Username");
  });

  it("updateUsername - citizen with expired passport", async function () {
    const { otherAccount, discordUsernames, passportIssuer } = await loadFixture(
      deploymentFixture
    );

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
      discordUsernames.connect(otherAccount).updateUsername("Other Username")
    ).to.be.revertedWithCustomError(discordUsernames, "PassportExpired");

    const usernameAfterUpdate = await discordUsernames.usernames(
      otherAccount.address
    );
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("");
  });
});
