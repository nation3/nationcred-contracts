import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("OperatorSkillLevels", function () {
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

    const OperatorSkillLevels = await ethers.getContractFactory("OperatorSkillLevels");
    const operatorSkillLevels = await OperatorSkillLevels.deploy(
      passportUtils.address
    );
    await operatorSkillLevels.deployed();

    return { owner, otherAccount, operatorSkillLevels, votingEscrow, passportUtils, passportIssuer };
  }

  it("setOwner", async function() {
    const { owner, otherAccount, operatorSkillLevels } = await loadFixture(deploymentFixture);

    let contractOwner = await operatorSkillLevels.owner();
    expect(contractOwner).to.equal(owner.address);

    await operatorSkillLevels.setOwner(otherAccount.address);

    contractOwner = await operatorSkillLevels.owner();
    expect(contractOwner).to.equal(otherAccount.address);
  });

  it("setPassportUtils", async function() {
    const { operatorSkillLevels, passportUtils } = await loadFixture(deploymentFixture);

    let contractPassportUtils = await operatorSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(passportUtils.address);

    await operatorSkillLevels.setPassportUtils(ethers.constants.AddressZero);

    contractPassportUtils = await operatorSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(ethers.constants.AddressZero);
  });

  it("rate - not passport owner", async function () {
    const { otherAccount, operatorSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        operatorSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(operatorSkillLevels, "NotPassportOwner");

    const skillLevel = await operatorSkillLevels.skillLevelAverages(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("no skill level rating for citizen", async function () {
    const { owner, operatorSkillLevels } = await loadFixture(deploymentFixture);

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - citizen with expired passport", async function () {
    const { otherAccount, operatorSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
        operatorSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(operatorSkillLevels, "PassportExpired");

    const skillLevel = await operatorSkillLevels.skillLevelAverages(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - citizen with valid passport", async function () {
    const { owner, operatorSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    const tx = await operatorSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - rating value error", async function () {
    const { owner, operatorSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    await expect(
        operatorSkillLevels.rate(owner.address, 6)
    ).to.be.revertedWithCustomError(operatorSkillLevels, "RatingValueError");

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - self-rating - two ratings with the same value", async function () {
    const { owner, operatorSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await operatorSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await operatorSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - self-rating - two ratings with different values", async function () {
    const { owner, operatorSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await operatorSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await operatorSkillLevels.rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('4'));
  });

  it("rate - two citizens rating - each rating with a different value", async function () {
    const { owner, otherAccount, operatorSkillLevels, votingEscrow, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await operatorSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);
    
    // Send veNATION to the other account to enable rating
    await votingEscrow.transfer(otherAccount.address, ethers.utils.parseUnits("50"));
    expect(
        await votingEscrow.balanceOf(otherAccount.address)
    ).to.equal(ethers.utils.parseUnits("50"));

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    tx = await operatorSkillLevels.connect(otherAccount).rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await operatorSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3.5'));
  });
});
