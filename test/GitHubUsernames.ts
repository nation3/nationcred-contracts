import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("GitHubUsernames", function() {
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

    const GitHubUsernames = await ethers.getContractFactory("GitHubUsernames");
    const githubUsernames = await GitHubUsernames.deploy(passportUtils.address);
    await githubUsernames.deployed();

    return { owner, otherAccount, githubUsernames };
  }

  it("usernames empty", async function() {
    const { owner, githubUsernames } = await loadFixture(
      deploymentFixture
    );

    const username = await githubUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername - citizen with valid passport", async function() {
    const { owner, githubUsernames } = await loadFixture(
      deploymentFixture
    );

    const tx = await githubUsernames.updateUsername("New Username");
    console.log('tx:', tx);

    const usernameAfterUpdate = await githubUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("New Username");
  });

  it("updateUsername - citizen with expired passport", async function() {
    const { otherAccount, githubUsernames } = await loadFixture(
      deploymentFixture
    );
    
    await expect(githubUsernames.connect(otherAccount).updateUsername("Other Username")).to.be.revertedWithCustomError(
      githubUsernames,
      "PassportExpired"
    );

    const usernameAfterUpdate = await githubUsernames.usernames(otherAccount.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("");
  });
});
