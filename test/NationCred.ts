import { expect } from "chai";
import { ethers } from "hardhat";

describe("NationCred", function () {
  it("Deploy contract", async function () {
    const [owner] = await ethers.getSigners();

    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    expect(await nationCred.owner()).to.equal(owner.address);
  });

  it("isActiveID - none", async function () {
    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    expect(await nationCred.isActiveID(40)).to.equal(false);
    expect(await nationCred.isActiveID(42)).to.equal(false);
    expect(await nationCred.isActiveID(44)).to.equal(false);
  });

  it("isActiveID - setActiveCitizens called once", async function () {
    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    await nationCred.setActiveCitizens([40, 42, 44]);

    expect(await nationCred.isActiveID(40)).to.equal(true);
    expect(await nationCred.isActiveID(42)).to.equal(true);
    expect(await nationCred.isActiveID(44)).to.equal(true);
  });

  it("isActiveID - setActiveCitizens called twice", async function () {
    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    await nationCred.setActiveCitizens([40, 42, 44]);

    await nationCred.setActiveCitizens([42]);

    expect(await nationCred.isActiveID(40)).to.equal(false);
    expect(await nationCred.isActiveID(42)).to.equal(true);
    expect(await nationCred.isActiveID(44)).to.equal(false);
  });

  it("setActiveCitizens - set 420 passport IDs", async function () {
    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    const passportIDs = [];
    for (let i = 0; i < 420; i++) {
      passportIDs.push(i);
    }
    console.log("passportIDs:", passportIDs);

    await nationCred.setActiveCitizens(passportIDs);

    expect(await nationCred.isActiveID(0)).to.equal(true);
    expect(await nationCred.isActiveID(100)).to.equal(true);
    expect(await nationCred.isActiveID(200)).to.equal(true);
    expect(await nationCred.isActiveID(300)).to.equal(true);
    expect(await nationCred.isActiveID(400)).to.equal(true);
    expect(await nationCred.isActiveID(419)).to.equal(true);
    expect(await nationCred.isActiveID(420)).to.equal(false);
  });

  it("isActiveAddress - none", async function () {
    const [owner] = await ethers.getSigners();

    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    expect(await nationCred.isActiveAddress(owner.address)).to.equal(false);
  });

  it("isActiveAddress - 1 passport, 1 active", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    // Mint passport #0
    await pass3.safeMint(owner.address);

    await nationCred.setActiveCitizens([0]);
    expect(await nationCred.isActiveAddress(owner.address)).to.equal(true);
    expect(await nationCred.isActiveAddress(otherAccount.address)).to.equal(
      false
    );
  });

  it("isActiveAddress - 2 passports, 1 active", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    // Mint passport #0
    await pass3.safeMint(owner.address);

    // Mint passport #1
    await pass3.safeMint(otherAccount.address);

    await nationCred.setActiveCitizens([0]);
    expect(await nationCred.isActiveAddress(owner.address)).to.equal(true);
    expect(await nationCred.isActiveAddress(otherAccount.address)).to.equal(
      false
    );
  });

  it("isActiveAddress - 2 passports, 2 active", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const PASS3 = await ethers.getContractFactory("PassportMock");
    const pass3 = await PASS3.deploy();

    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy(pass3.address);
    await nationCred.deployed();

    // Mint passport #0
    await pass3.safeMint(owner.address);

    // Mint passport #1
    await pass3.safeMint(otherAccount.address);

    await nationCred.setActiveCitizens([0, 1]);
    expect(await nationCred.isActiveAddress(owner.address)).to.equal(true);
    expect(await nationCred.isActiveAddress(otherAccount.address)).to.equal(
      true
    );
  });
});
