import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1_000;

describe("DiscourseUsernames", function () {
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

    const DiscourseUsernames = await ethers.getContractFactory("DiscourseUsernames");
    const discourseUsernames = await DiscourseUsernames.deploy(passportUtils.address);
    await discourseUsernames.deployed();

    return { owner, otherAccount, discourseUsernames, passportIssuer, votingEscrow };
  }

  it("usernames empty", async function () {
    const { owner, discourseUsernames } = await loadFixture(deploymentFixture);

    const username = await discourseUsernames.usernames(owner.address);
    console.log("username:", username);
    expect(username).to.equal("");
  });

  it("updateUsername - citizen with valid passport", async function () {
    const { owner, discourseUsernames, passportIssuer, votingEscrow } = await loadFixture(deploymentFixture);

    // Lock 3 $NATION for 4 years
    const lockAmount = ethers.utils.parseUnits("3");
    const lockEnd = new Date(
      new Date().getTime() + 4 * oneYearInMilliseconds
    );
    const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
    await votingEscrow.create_lock(
      lockAmount,
      ethers.BigNumber.from(lockEndInSeconds)
    );

    // Claim passport
    await passportIssuer.claim();

    const tx = await discourseUsernames.updateUsername("New Username");
    console.log("tx:", tx);

    const usernameAfterUpdate = await discourseUsernames.usernames(owner.address);
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("New Username");
  });

  it("updateUsername - citizen with expired passport", async function () {
    const { otherAccount, discourseUsernames, passportIssuer } = await loadFixture(
      deploymentFixture
    );

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
      discourseUsernames.connect(otherAccount).updateUsername("Other Username")
    ).to.be.revertedWithCustomError(discourseUsernames, "PassportExpired");

    const usernameAfterUpdate = await discourseUsernames.usernames(
      otherAccount.address
    );
    console.log("usernameAfterUpdate:", usernameAfterUpdate);
    expect(usernameAfterUpdate).to.equal("");
  });
});
