import { expect } from "chai";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1_000;

describe("PassportUtils", function () {
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
    // await passportUtils.deployed();

    return { votingEscrow, passportUtils, owner, otherAccount, passportIssuer };
  }

  describe("isOwner", function () {
    it("should return true if a citizen's passport has not been revoked", async function () {
      const { passportUtils, owner, passportIssuer } = await loadFixture(
        deploymentFixture
      );

      // Claim passport
      await passportIssuer.claim();

      expect(await passportUtils.isOwner(owner.address)).to.equal(
        true
      );
    });
  });

  describe("isExpired", function () {
    it("should return true if voting escrow balance is zero", async function () {
      const { passportUtils, otherAccount } = await loadFixture(
        deploymentFixture
      );

      expect(await passportUtils.isExpired(otherAccount.address)).to.equal(
        true
      );
    });

    it("should return true if voting escrow balance is 1.4999", async function () {
      const { votingEscrow, passportUtils, otherAccount } = await loadFixture(
        deploymentFixture
      );

      // Transfer 1.4999 $veNATION to the second account
      await votingEscrow.transfer(
        otherAccount.address,
        ethers.utils.parseUnits("1.4999")
      );

      expect(await passportUtils.isExpired(otherAccount.address)).to.equal(
        true
      );
    });

    it("should return false if voting escrow balance is 1.5000", async function () {
      const { votingEscrow, passportUtils, otherAccount } = await loadFixture(
        deploymentFixture
      );

      // Transfer 1.5000 $veNATION to the second account
      await votingEscrow.transfer(
        otherAccount.address,
        ethers.utils.parseUnits("1.5000")
      );

      expect(await passportUtils.isExpired(otherAccount.address)).to.equal(
        false
      );
    });
  });

  describe("calculateThresholdTimestamp", function () {
    it("votingEscrowThreshold 1.5 - 3 $NATION locked for 4 years", async function () {
      const { passportUtils } = await loadFixture(deploymentFixture);

      const lockAmount = ethers.utils.parseUnits("3");

      const lockEnd = new Date(
        new Date().getTime() + 4 * oneYearInMilliseconds
      );
      console.log("lockEnd:", lockEnd);
      const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
      console.log("lockEndInSeconds:", lockEndInSeconds);

      const votingEscrowThreshold = ethers.utils.parseUnits("1.5");

      const expectedThresholdDate = new Date(
        new Date().getTime() + 2 * oneYearInMilliseconds
      );
      console.log("expectedThresholdDate:", expectedThresholdDate);
      const expectedThresholdDateInSeconds = Math.round(
        expectedThresholdDate.getTime() / 1_000
      );
      console.log(
        "expectedThresholdDateInSeconds:",
        expectedThresholdDateInSeconds
      );

      const calculatedThresholdTimestamp =
        await passportUtils.calculateThresholdTimestamp(
          lockAmount,
          ethers.BigNumber.from(lockEndInSeconds),
          votingEscrowThreshold
        );
      console.log(
        "calculatedThresholdTimestamp:",
        new Date(calculatedThresholdTimestamp * 1_000)
      );
      expect(calculatedThresholdTimestamp).to.equal(
        ethers.BigNumber.from(expectedThresholdDateInSeconds)
      );
    });

    it("votingEscrowThreshold 1.5 - 6 $NATION locked for 4 years", async function () {
      const { passportUtils } = await loadFixture(deploymentFixture);

      const lockAmount = ethers.utils.parseUnits("6");

      const lockEnd = new Date(
        new Date().getTime() + 4 * oneYearInMilliseconds
      );
      console.log("lockEnd:", lockEnd);
      const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
      console.log("lockEndInSeconds:", lockEndInSeconds);

      const votingEscrowThreshold = ethers.utils.parseUnits("1.5");

      const expectedThresholdDate = new Date(
        new Date().getTime() + 3 * oneYearInMilliseconds
      );
      console.log("expectedThresholdDate:", expectedThresholdDate);
      const expectedThresholdDateInSeconds = Math.round(
        expectedThresholdDate.getTime() / 1_000
      );
      console.log(
        "expectedThresholdDateInSeconds:",
        expectedThresholdDateInSeconds
      );

      const calculatedThresholdTimestamp =
        await passportUtils.calculateThresholdTimestamp(
          lockAmount,
          ethers.BigNumber.from(lockEndInSeconds),
          votingEscrowThreshold
        );
      console.log(
        "calculatedThresholdTimestamp:",
        new Date(calculatedThresholdTimestamp * 1_000)
      );
      expect(calculatedThresholdTimestamp).to.equal(
        ethers.BigNumber.from(expectedThresholdDateInSeconds)
      );
    });

    it("votingEscrowThreshold 1.5 - 1 $NATION locked for 4 years", async function () {
      const { passportUtils } = await loadFixture(deploymentFixture);

      const lockAmount = ethers.utils.parseUnits("1");

      const lockEnd = new Date(
        new Date().getTime() + 4 * oneYearInMilliseconds
      );
      console.log("lockEnd:", lockEnd);
      const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
      console.log("lockEndInSeconds:", lockEndInSeconds);

      const votingEscrowThreshold = ethers.utils.parseUnits("1.5");

      const calculatedThresholdTimestamp =
        await passportUtils.calculateThresholdTimestamp(
          lockAmount,
          ethers.BigNumber.from(lockEndInSeconds),
          votingEscrowThreshold
        );
      console.log(
        "calculatedThresholdTimestamp:", calculatedThresholdTimestamp
      );
      expect(calculatedThresholdTimestamp).to.equal(0);
    });
  });

  describe("getExpirationTimestamp", function () {
    it("votingEscrowThreshold 1.5 - 3 $NATION locked for 4 years", async function () {
      const { votingEscrow, passportUtils, owner } = await loadFixture(
        deploymentFixture
      );

      const initialLockDate = new Date();
      console.log("initialLockDate:", initialLockDate);

      // Lock 3 $NATION for 4 years
      const lockAmount = ethers.utils.parseUnits("3");
      const lockEnd = new Date(
        initialLockDate.getTime() + 4 * oneYearInMilliseconds
      );
      console.log("lockEnd:", lockEnd);
      const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
      await votingEscrow.create_lock(
        lockAmount,
        ethers.BigNumber.from(lockEndInSeconds)
      );

      const expectedExpirationDate = new Date(
        initialLockDate.getTime() + 2 * oneYearInMilliseconds
      );
      console.log("expectedExpirationDate:", expectedExpirationDate);
      const expectedExpirationDateInSeconds = Math.round(
        expectedExpirationDate.getTime() / 1_000
      );
      console.log(
        "expectedExpirationDateInSeconds:",
        expectedExpirationDateInSeconds
      );

      const expirationTimestamp = await passportUtils.getExpirationTimestamp(
        owner.address
      );
      console.log("expirationTimestamp:", expirationTimestamp);
      console.log(
        "expirationTimestamp (Date):",
        new Date(expirationTimestamp * 1_000)
      );
      expect(expirationTimestamp).to.equal(
        ethers.BigNumber.from(expectedExpirationDateInSeconds)
      );
    });

    it("votingEscrowThreshold 1.5 - 6 $NATION locked for 4 years", async function () {
      const { votingEscrow, passportUtils, owner } = await loadFixture(
        deploymentFixture
      );

      const initialLockDate = new Date();
      console.log("initialLockDate:", initialLockDate);

      // Lock 6 $NATION for 4 years
      const lockAmount = ethers.utils.parseUnits("6");
      const lockEnd = new Date(
        initialLockDate.getTime() + 4 * oneYearInMilliseconds
      );
      console.log("lockEnd:", lockEnd);
      const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
      await votingEscrow.create_lock(
        lockAmount,
        ethers.BigNumber.from(lockEndInSeconds)
      );

      const expectedExpirationDate = new Date(
        initialLockDate.getTime() + 3 * oneYearInMilliseconds
      );
      console.log("expectedExpirationDate:", expectedExpirationDate);
      const expectedExpirationDateInSeconds = Math.round(
        expectedExpirationDate.getTime() / 1_000
      );
      console.log(
        "expectedExpirationDateInSeconds:",
        expectedExpirationDateInSeconds
      );

      const expirationTimestamp = await passportUtils.getExpirationTimestamp(
        owner.address
      );
      console.log("expirationTimestamp:", expirationTimestamp);
      console.log(
        "expirationTimestamp (Date):",
        new Date(expirationTimestamp * 1_000)
      );
      expect(expirationTimestamp).to.equal(
        ethers.BigNumber.from(expectedExpirationDateInSeconds)
      );
    });
  });
});
