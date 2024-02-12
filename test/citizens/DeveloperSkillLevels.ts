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

    const EAS = await ethers.getContractFactory("EASMock");
    const eas = await EAS.deploy();

    const easSchemaUID = "0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b"; // Sepolia - https://sepolia.easscan.org/schema/view/0x8233d9319f24851e27b79cd7c3afe2e22a125b722435733d8b428b85d6e2ab8b

    const DeveloperSkillLevels = await ethers.getContractFactory("DeveloperSkillLevels");
    const developerSkillLevels = await DeveloperSkillLevels.deploy(
      passportUtils.address,
      eas.address,
      easSchemaUID
    );
    await developerSkillLevels.deployed();

    return { owner, otherAccount, developerSkillLevels, votingEscrow, passportUtils, passportIssuer };
  }

  it("setOwner", async function() {
    const { owner, otherAccount, developerSkillLevels } = await loadFixture(deploymentFixture);

    let contractOwner = await developerSkillLevels.owner();
    expect(contractOwner).to.equal(owner.address);

    await developerSkillLevels.setOwner(otherAccount.address);

    contractOwner = await developerSkillLevels.owner();
    expect(contractOwner).to.equal(otherAccount.address);
  });

  it("setPassportUtils", async function() {
    const { developerSkillLevels, passportUtils } = await loadFixture(deploymentFixture);

    let contractPassportUtils = await developerSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(passportUtils.address);

    await developerSkillLevels.setPassportUtils(ethers.constants.AddressZero);

    contractPassportUtils = await developerSkillLevels.passportUtils();
    expect(contractPassportUtils).to.equal(ethers.constants.AddressZero);
  });

  it("no skill level rating for citizen", async function () {
    const { owner, developerSkillLevels } = await loadFixture(deploymentFixture);

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - not passport owner", async function () {
    const { otherAccount, developerSkillLevels } = await loadFixture(deploymentFixture);

    await expect(
        developerSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(developerSkillLevels, "NotPassportOwner");

    const skillLevel = await developerSkillLevels.skillLevelAverages(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - citizen with expired passport", async function () {
    const { otherAccount, developerSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
        developerSkillLevels.connect(otherAccount).rate(otherAccount.address, 3)
    ).to.be.revertedWithCustomError(developerSkillLevels, "PassportExpired");

    const skillLevel = await developerSkillLevels.skillLevelAverages(otherAccount.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });
  
  it("rate - citizen with valid passport", async function () {
    const { owner, developerSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    const tx = await developerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - rating value error", async function () {
    const { owner, developerSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    await expect(
        developerSkillLevels.rate(owner.address, 6)
    ).to.be.revertedWithCustomError(developerSkillLevels, "RatingValueError");

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(0);
  });

  it("rate - self-rating - two ratings with the same value", async function () {
    const { owner, developerSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await developerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await developerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3'));
  });

  it("rate - self-rating - two ratings with different values", async function () {
    const { owner, developerSkillLevels, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await developerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);

    tx = await developerSkillLevels.rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('4'));
  });

  it("rate - two citizens rating - each rating with a different value", async function () {
    const { owner, otherAccount, developerSkillLevels, votingEscrow, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(owner).claim();

    let tx = await developerSkillLevels.rate(owner.address, 3);
    // console.log('tx:', tx);
    
    // Send veNATION to the other account to enable rating
    await votingEscrow.transfer(otherAccount.address, ethers.utils.parseUnits("50"));
    expect(
        await votingEscrow.balanceOf(otherAccount.address)
    ).to.equal(ethers.utils.parseUnits("50"));

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    tx = await developerSkillLevels.connect(otherAccount).rate(owner.address, 4);
    // console.log('tx:', tx);

    const skillLevel = await developerSkillLevels.skillLevelAverages(owner.address);
    console.log('skillLevel:', skillLevel);
    expect(skillLevel).to.equal(ethers.utils.parseUnits('3.5'));
  });
});