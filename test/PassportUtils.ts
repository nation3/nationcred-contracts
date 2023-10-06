import { expect } from "chai";
import { loadFixture } from "ethereum-waffle";
import { ethers } from "hardhat";

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

    return { votingEscrow, passportUtils, owner, otherAccount };
  }

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

      // Transfer 1.4999 $NATION to the second account
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

      // Transfer 1.5000 $NATION to the second account
      await votingEscrow.transfer(
        otherAccount.address,
        ethers.utils.parseUnits("1.5000")
      );

      expect(await passportUtils.isExpired(otherAccount.address)).to.equal(
        false
      );
    });
  });
});
