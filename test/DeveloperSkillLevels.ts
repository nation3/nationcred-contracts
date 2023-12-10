import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("DeveloperSkillLevels", function () {
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

    const DeveloperSkillLevels = await ethers.getContractFactory("DeveloperSkillLevels");
    const developerSkillLevels = await DeveloperSkillLevels.deploy(passportUtils.address);
    await developerSkillLevels.deployed();

    return { owner, otherAccount, developerSkillLevels };
  }

  it("no skill level rating for citizen", async function () {
    const { owner, developerSkillLevels } = await loadFixture(deploymentFixture);

    const skillLevel = await developerSkillLevels.skillLevels(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - citizen with valid passport", async function () {
    const { owner, developerSkillLevels } = await loadFixture(deploymentFixture);

    const tx = await developerSkillLevels.rate(owner.address, 3);
    console.log('tx:', tx);

    const skillLevel = await developerSkillLevels.skillLevels(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(3);
  });

  it("rate - citizen with expired passport", async function () {
    const { otherAccount, developerSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        developerSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(developerSkillLevels, "PassportExpired");

    const skillLevel = await developerSkillLevels.skillLevels(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - rating value error", async function () {
    const { owner, developerSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        developerSkillLevels.rate(owner.address, 6)
    ).to.be.revertedWithCustomError(developerSkillLevels, "RatingValueError");

    const skillLevel = await developerSkillLevels.skillLevels(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });
});
