import { expect } from "chai";
import { ethers } from "hardhat";

describe("RBAC", function () {
  let rbacContract: any;
  let owner: any;
  let admin: any;
  let user: any;

  let ADMIN_ROLE: string;
  let DUKCAPIL_ROLE: string;

  beforeEach(async function () {
    [owner, admin, user] = await ethers.getSigners();
    const RBAC = await ethers.getContractFactory("RBAC");
    rbacContract = await RBAC.deploy();

    ADMIN_ROLE = await rbacContract.ADMIN_ROLE();
    DUKCAPIL_ROLE = await rbacContract.DUKCAPIL_ROLE();
  });

  describe("Deployment", function () {
    it("Should grant ADMIN_ROLE and DEFAULT_ADMIN_ROLE to the deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await rbacContract.DEFAULT_ADMIN_ROLE();
      expect(await rbacContract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await rbacContract.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Admin should be able to grant a role", async function () {
      // Grant DUKCAPIL_ROLE to 'admin' account
      await rbacContract.connect(owner).grantRole(DUKCAPIL_ROLE, admin.address);
      expect(await rbacContract.hasRole(DUKCAPIL_ROLE, admin.address)).to.be.true;
    });

    it("Non-admin should not be able to grant a role", async function () {
      // Try to grant DUKCAPIL_ROLE from 'user' account (who is not an admin)
      await expect(rbacContract.connect(user).grantRole(DUKCAPIL_ROLE, admin.address))
        .to.be.reverted; // It will revert with a message like "AccessControl: account ... is missing role ..."
    });

    it("Admin should be able to revoke a role", async function () {
      await rbacContract.connect(owner).grantRole(DUKCAPIL_ROLE, admin.address);
      expect(await rbacContract.hasRole(DUKCAPIL_ROLE, admin.address)).to.be.true;

      await rbacContract.connect(owner).revokeRole(DUKCAPIL_ROLE, admin.address);
      expect(await rbacContract.hasRole(DUKCAPIL_ROLE, admin.address)).to.be.false;
    });

    it("Should return false for a user that does not have a role", async function () {
        expect(await rbacContract.hasRole(DUKCAPIL_ROLE, user.address)).to.be.false;
    });
  });
});
