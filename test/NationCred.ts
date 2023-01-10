import { expect } from "chai";
import { ethers } from "hardhat";

describe("NationCred contract", function () {
  async function deployActiveCitizens() {
    const NationCred = await ethers.getContractFactory("NationCred");
    const nationCred = await NationCred.deploy();
    await nationCred.deployed();
  }

  it("Should add new citizen to list of active citizens", async function () {

  });

  it("Should check if citizen already exist on active citizen list", async function () {

  });

  it("Should remove citizen's address from list of active citizen", async function () {

  });

  it("Should be able to view addresses of all active citizens", async function () {

  });
});
