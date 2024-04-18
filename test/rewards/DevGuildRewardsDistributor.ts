import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

describe("DevGuildRewardsDistributor", function () {
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

    const CLIFF_VESTING_DATE = await time.latest() + ONE_YEAR_IN_SECS;

    const DevGuildRewardsDistributor = await ethers.getContractFactory("DevGuildRewardsDistributor");
    const devGuildRewardsDistributor = await DevGuildRewardsDistributor.deploy(
      passportUtils.address,
      rewardToken.address,
      CLIFF_VESTING_DATE
    );
    await devGuildRewardsDistributor.deployed();

    return { owner, otherAccount, devGuildRewardsDistributor, votingEscrow, passportUtils, passportIssuer, rewardToken };
  }

  it("setOwner", async function() {
    const { owner, otherAccount, devGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    let contractOwner = await devGuildRewardsDistributor.owner();
    expect(contractOwner).to.equal(owner.address);

    await devGuildRewardsDistributor.setOwner(otherAccount.address);

    contractOwner = await devGuildRewardsDistributor.owner();
    expect(contractOwner).to.equal(otherAccount.address);
  });

  it("setPassportUtils", async function() {
    const { devGuildRewardsDistributor, passportUtils } = await loadFixture(deploymentFixture);

    let contractPassportUtils = await devGuildRewardsDistributor.passportUtils();
    expect(contractPassportUtils).to.equal(passportUtils.address);

    await devGuildRewardsDistributor.setPassportUtils(ethers.constants.AddressZero);

    contractPassportUtils = await devGuildRewardsDistributor.passportUtils();
    expect(contractPassportUtils).to.equal(ethers.constants.AddressZero);
  });

  it("addReward", async function () {
    const { otherAccount, devGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    await devGuildRewardsDistributor.addReward(otherAccount.address, ethers.utils.parseEther("3"))

    const claimable = await devGuildRewardsDistributor.claimable(otherAccount.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));
  });

  it("claim - not passport owner", async function () {
    const { otherAccount, devGuildRewardsDistributor } = await loadFixture(deploymentFixture);

    await expect(
      devGuildRewardsDistributor.connect(otherAccount).claim()
    ).to.be.revertedWithCustomError(devGuildRewardsDistributor, "NotPassportOwner");

    const claimed = await devGuildRewardsDistributor.claimed(otherAccount.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });

  it("claim - citizen with expired passport", async function () {
    const { otherAccount, devGuildRewardsDistributor, passportIssuer } = await loadFixture(deploymentFixture);

    // Claim passport
    await passportIssuer.connect(otherAccount).claim();

    await expect(
      devGuildRewardsDistributor.connect(otherAccount).claim()
    ).to.be.revertedWithCustomError(devGuildRewardsDistributor, "PassportExpired");

    const claimed = await devGuildRewardsDistributor.claimed(otherAccount.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });
  
  it("claim - citizen with valid passport - vesting date not yet reached", async function () {
    const { owner, devGuildRewardsDistributor, passportIssuer, rewardToken, votingEscrow } = await loadFixture(deploymentFixture);
    
    // Lock 3 $NATION for 4 years
    const initialLockDate = new Date(await time.latest() * 1_000);
    console.log("initialLockDate:", initialLockDate);
    const lockAmount = ethers.utils.parseUnits("3");
    const lockEnd = new Date(
      initialLockDate.getTime() + 4 * ONE_YEAR_IN_SECS * 1_000
    );
    const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
    await votingEscrow.create_lock(
      lockAmount,
      ethers.BigNumber.from(lockEndInSeconds)
    );
    
    // Claim passport
    await passportIssuer.claim();

    // Add reward
    await devGuildRewardsDistributor.addReward(owner.address, ethers.utils.parseEther("3"));
    let claimable = await devGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    // Transfer reward tokens to the contract
    await rewardToken.mint(devGuildRewardsDistributor.address, ethers.utils.parseEther("100"));
    
    // Claim reward
    await expect(
      devGuildRewardsDistributor.claim()
    ).to.be.revertedWithCustomError(devGuildRewardsDistributor, "NotYetVestingDate");

    claimable = await devGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    const claimed = await devGuildRewardsDistributor.claimed(owner.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(0);
  });

  it("claim - citizen with valid passport - vesting date reached", async function () {
    const { owner, devGuildRewardsDistributor, passportIssuer, rewardToken, votingEscrow } = await loadFixture(deploymentFixture);
    
    // Lock 3 $NATION for 4 years
    const initialLockDate = new Date(await time.latest() * 1_000);
    console.log("initialLockDate:", initialLockDate);
    const lockAmount = ethers.utils.parseUnits("3");
    const lockEnd = new Date(
      initialLockDate.getTime() + 4 * ONE_YEAR_IN_SECS * 1_000
    );
    const lockEndInSeconds = Math.round(lockEnd.getTime() / 1_000);
    await votingEscrow.create_lock(
      lockAmount,
      ethers.BigNumber.from(lockEndInSeconds)
    );
    
    // Claim passport
    await passportIssuer.claim();

    // Add reward
    await devGuildRewardsDistributor.addReward(owner.address, ethers.utils.parseEther("3"));
    let claimable = await devGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(ethers.utils.parseEther("3"));

    // Transfer reward tokens to the contract
    await rewardToken.mint(devGuildRewardsDistributor.address, ethers.utils.parseEther("100"));
    
    // Simulate the passage of time, to 1 week past the vesting date
    const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
    const oneWeekPastVestingDate = Number(await devGuildRewardsDistributor.CLIFF_VESTING_DATE()) + ONE_WEEK_IN_SECS;
    console.log('oneWeekPastVestingDate:', oneWeekPastVestingDate);
    await time.increaseTo(oneWeekPastVestingDate);
    
    // Claim reward
    await devGuildRewardsDistributor.claim();

    claimable = await devGuildRewardsDistributor.claimable(owner.address);
    console.log('claimable:', claimable);
    expect(claimable).to.equal(0);

    const claimed = await devGuildRewardsDistributor.claimed(owner.address);
    console.log('claimed:', claimed);
    expect(claimed).to.equal(ethers.utils.parseEther("3"));
  });
});
