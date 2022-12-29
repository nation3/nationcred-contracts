import { expect } from "chai";
import { ethers } from "hardhat";

describe("ActiveCitizens contract", function () {
  async function deployActiveCitizens() {
    const ActiveCitizens = await ethers.getContractFactory("ActiveCitizens");
    const activeCitizens = await ActiveCitizens.deploy();
    await activeCitizens.deployed();
  }

  it("Should add new citizen to list of active citizens", async function () {

  });

  it("Should check if citizen already exist on active citizen list", async function() {

  });

  it("Should remove citizen's address from list of active citizen", async function () {

  });

  it("Should be able to view addresses of all active citizens", async function () {

  });
});
