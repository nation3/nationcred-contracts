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
});