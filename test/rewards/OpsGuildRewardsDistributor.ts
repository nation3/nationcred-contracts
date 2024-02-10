import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("OpsGuildRewardsDistributor", function () {
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

    const RewardToken = await ethers.getContractFactory("ERC20Mock");
    const rewardToken = await RewardToken.deploy();

    const OpsGuildRewardsDistributor = await ethers.getContractFactory("OpsGuildRewardsDistributor");
    const opsGuildRewardsDistributor = await OpsGuildRewardsDistributor.deploy(
      passportUtils.address,
      rewardToken.address
    );
    await opsGuildRewardsDistributor.deployed();

    return { owner, otherAccount, opsGuildRewardsDistributor, votingEscrow, passportUtils, passportIssuer, rewardToken };
  }

  it("setOwner", async function() {
    const { owner, otherAccount, opsGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    let contractOwner = await opsGuildRewardsDistributor.owner();
    expect(contractOwner).to.equal(owner.address);

    await opsGuildRewardsDistributor.setOwner(otherAccount.address);

    contractOwner = await opsGuildRewardsDistributor.owner();
    expect(contractOwner).to.equal(otherAccount.address);
  });

  it("setPassportUtils", async function() {
    const { opsGuildRewardsDistributor, passportUtils } = await loadFixture(deploymentFixture);

    let contractPassportUtils = await opsGuildRewardsDistributor.passportUtils();
    expect(contractPassportUtils).to.equal(passportUtils.address);

    await opsGuildRewardsDistributor.setPassportUtils(ethers.constants.AddressZero);

    contractPassportUtils = await opsGuildRewardsDistributor.passportUtils();
    expect(contractPassportUtils).to.equal(ethers.constants.AddressZero);
  });

  it("addReward", async function () {
    const { otherAccount, opsGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    await opsGuildRewardsDistributor.addReward(otherAccount.address, ethers.utils.parseEther("3"))

    const claimable = await opsGuildRewardsDistributor.claimable(otherAccount.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));
  });

  it("claim - not passport owner", async function () {
    const { otherAccount, opsGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    await expect(
      opsGuildRewardsDistributor.connect(otherAccount).claim()
    ).to.be.revertedWithCustomError(opsGuildRewardsDistributor, "NotPassportOwner");

    const claimed = await opsGuildRewardsDistributor.claimed(otherAccount.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });

  it("claim - citizen with expired passport", async function () {
    const { otherAccount, opsGuildRewardsDistributor, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
      opsGuildRewardsDistributor.connect(otherAccount).claim()
    ).to.be.revertedWithCustomError(opsGuildRewardsDistributor, "PassportExpired");

    const claimed = await opsGuildRewardsDistributor.claimed(otherAccount.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });
  
  it("claim - citizen with valid passport - vesting date not yet reached", async function () {
    const { owner, opsGuildRewardsDistributor, passportIssuer, rewardToken } = await loadFixture(deploymentFixture);
    
    // Claim passport
    await passportIssuer.claim();

    // Add reward
    await opsGuildRewardsDistributor.addReward(owner.address, ethers.utils.parseEther("3"));
    let claimable = await opsGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    // Transfer reward tokens to the contract
    await rewardToken.mint(opsGuildRewardsDistributor.address, ethers.utils.parseEther("100"));
    
    // Claim reward
    await expect(
      opsGuildRewardsDistributor.claim()
    ).to.be.revertedWithCustomError(opsGuildRewardsDistributor, "NotYetVestingDate");

    claimable = await opsGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    const claimed = await opsGuildRewardsDistributor.claimed(owner.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });

  it("claim - citizen with valid passport - vesting date reached", async function () {
    const { owner, opsGuildRewardsDistributor, passportIssuer, rewardToken } = await loadFixture(deploymentFixture);
    
    // Claim passport
    await passportIssuer.claim();

    // Add reward
    await opsGuildRewardsDistributor.addReward(owner.address, ethers.utils.parseEther("3"));
    let claimable = await opsGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    // Transfer reward tokens to the contract
    await rewardToken.mint(opsGuildRewardsDistributor.address, ethers.utils.parseEther("100"));
    
    const sixtyWeeksInSeconds = 60 * 7 * 24 * 60 * 60 * 1_000;
    await time.increase(sixtyWeeksInSeconds);
    
    // Claim reward
    await opsGuildRewardsDistributor.claim();

    claimable = await opsGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(0);

    const claimed = await opsGuildRewardsDistributor.claimed(owner.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(ethers.utils.parseEther("3"));
  });
});
