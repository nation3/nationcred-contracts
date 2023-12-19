import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MarketeerSkillLevels", function () {
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

    const MarketeerSkillLevels = await ethers.getContractFactory("MarketeerSkillLevels");
    const marketeerSkillLevels = await MarketeerSkillLevels.deploy(passportUtils.address);
    await marketeerSkillLevels.deployed();

    return { owner, otherAccount, marketeerSkillLevels, votingEscrow, passportUtils };
  }

  it("setOwner", async function() {
    const { owner, otherAccount, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    let contractOwner = await marketeerSkillLevels.owner();
    expect(contractOwner).to.equal(owner.address);

    await marketeerSkillLevels.setOwner(otherAccount.address);

    contractOwner = await marketeerSkillLevels.owner();
    expect(contractOwner).to.equal(otherAccount.address);
  });

  it("setPassportUtils", async function() {
    const { marketeerSkillLevels, passportUtils } = await loadFixture(deploymentFixture);

    let contractPassportUtils = await marketeerSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(passportUtils.address);

    await marketeerSkillLevels.setPassportUtils(ethers.constants.AddressZero);

    contractPassportUtils = await marketeerSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(ethers.constants.AddressZero);
  });

  it("no skill level rating for citizen", async function () {
    const { owner, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - citizen with valid passport", async function () {
    const { owner, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    const tx = await marketeerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - citizen with expired passport", async function () {
    const { otherAccount, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        marketeerSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(marketeerSkillLevels, "PassportExpired");

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - rating value error", async function () {
    const { owner, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        marketeerSkillLevels.rate(owner.address, 6)
    ).to.be.revertedWithCustomError(marketeerSkillLevels, "RatingValueError");

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - self-rating - two ratings with the same value", async function () {
    const { owner, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    let tx = await marketeerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await marketeerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - self-rating - two ratings with different values", async function () {
    const { owner, marketeerSkillLevels } = await loadFixture(deploymentFixture);

    let tx = await marketeerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await marketeerSkillLevels.rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('4'));
  });

  it("rate - two citizens rating - each rating with a different value", async function () {
    const { owner, otherAccount, marketeerSkillLevels, votingEscrow } = await loadFixture(deploymentFixture);

    let tx = await marketeerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);
    
    // Send veNATION to the other account to enable rating
    await votingEscrow.transfer(otherAccount.address, ethers.utils.parseUnits("50"));
    expect(
        await votingEscrow.balanceOf(otherAccount.address)
    ).to.equal(ethers.utils.parseUnits("50"));

    tx = await marketeerSkillLevels.connect(otherAccount).rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await marketeerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3.5'));
  });
});
