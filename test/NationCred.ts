import { expect } from "chai";
import { ethers } from "hardhat";

describe("NationCred", function () {
  it("Deploy contract", async function () {
    const [owner] = await ethers.getSigners();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();

    expect(await nationCred.owner()).to.equal(owner.address);
  });

  it("isActive - none", async function () {
    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();
    expect(await nationCred.isActive(40)).to.equal(false);
    expect(await nationCred.isActive(42)).to.equal(false);
    expect(await nationCred.isActive(44)).to.equal(false);
  });

  it("isActive - setActiveCitizens called once", async function () {
    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();

    await nationCred.setActiveCitizens([40, 42, 44]);

    expect(await nationCred.isActive(40)).to.equal(true);
    expect(await nationCred.isActive(42)).to.equal(true);
    expect(await nationCred.isActive(44)).to.equal(true);
  });

  it("isActive - setActiveCitizens called twice", async function () {
    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();

    await nationCred.setActiveCitizens([40, 42, 44]);

    await nationCred.setActiveCitizens([42]);

    expect(await nationCred.isActive(40)).to.equal(false);
    expect(await nationCred.isActive(42)).to.equal(true);
    expect(await nationCred.isActive(44)).to.equal(false);
  });

  it("setActiveCitizens - set 420 passport IDs", async function () {
    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();

    const passportIDs = [];
    for (let i = 0; i < 420; i++) {
      passportIDs.push(i);
    }
    console.log("passportIDs:", passportIDs);

    await nationCred.setActiveCitizens(passportIDs);

    expect(await nationCred.isActive(0)).to.equal(true);
    expect(await nationCred.isActive(100)).to.equal(true);
    expect(await nationCred.isActive(200)).to.equal(true);
    expect(await nationCred.isActive(300)).to.equal(true);
    expect(await nationCred.isActive(400)).to.equal(true);
    expect(await nationCred.isActive(419)).to.equal(true);
    expect(await nationCred.isActive(420)).to.equal(false);
  });

  it("isPassportExpired - no passport", async function() {
    const [owner] = await ethers.getSigners();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();

    expect(await nationCred.isPassportExpired(owner.address)).to.equal(true);
  });
});
