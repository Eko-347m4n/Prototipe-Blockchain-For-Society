import { expect } from "chai";
import { ethers } from "hardhat";

describe("Identity", function () {
  let identityContract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const nikHash1 = ethers.keccak256(ethers.toUtf8Bytes("1234567890123456"));
  const nikHash2 = ethers.keccak256(ethers.toUtf8Bytes("6543210987654321"));

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Identity = await ethers.getContractFactory("Identity");
    identityContract = await Identity.deploy();
  });

  describe("Registration", function () {
    it("Should allow a new user to register", async function () {
      await expect(identityContract.connect(addr1).registerIdentity(nikHash1))
        .to.emit(identityContract, "IdentityRegistered")
        .withArgs(addr1.address, nikHash1);

      expect(await identityContract.getIdentity(addr1.address)).to.equal(nikHash1);
      expect(await identityContract.getWallet(nikHash1)).to.equal(addr1.address);
      expect(await identityContract.isRegistered(addr1.address)).to.be.true;
    });

    it("Should fail if address is already registered", async function () {
      await identityContract.connect(addr1).registerIdentity(nikHash1);

      await expect(identityContract.connect(addr1).registerIdentity(nikHash2))
        .to.be.revertedWith("Identity: Address already registered");
    });

    it("Should fail if identity hash is already registered", async function () {
      await identityContract.connect(addr1).registerIdentity(nikHash1);

      await expect(identityContract.connect(addr2).registerIdentity(nikHash1))
        .to.be.revertedWith("Identity: Hash already registered");
    });

    it("Should fail if identity hash is zero", async function () {
      await expect(identityContract.connect(addr1).registerIdentity(ethers.ZeroHash))
        .to.be.revertedWith("Identity: Hash cannot be zero");
    });
  });

  describe("Getters", function () {
    it("Should return correct values for registered user", async function () {
      await identityContract.connect(addr1).registerIdentity(nikHash1);
      expect(await identityContract.getIdentity(addr1.address)).to.equal(nikHash1);
      expect(await identityContract.getWallet(nikHash1)).to.equal(addr1.address);
      expect(await identityContract.isRegistered(addr1.address)).to.be.true;
    });

    it("Should return empty values for unregistered user", async function () {
      expect(await identityContract.getIdentity(addr2.address)).to.equal(ethers.ZeroHash);
      expect(await identityContract.getWallet(nikHash2)).to.equal(ethers.ZeroAddress);
      expect(await identityContract.isRegistered(addr2.address)).to.be.false;
    });
  });
});
