import { expect } from "chai";
import { ethers } from "hardhat";

describe("GitHub", function () {
  it("Deploy contract", async function () {
    const GitHub = await ethers.getContractFactory("GitHub");
    const gitHub = await GitHub.deploy();
    await gitHub.deployed();
  });
});
