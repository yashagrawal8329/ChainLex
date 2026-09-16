import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainLexRegistry } from "../typechain-types";

describe("ChainLexRegistry", function () {
  let registry: any;
  let owner: any;
  let addr1: any;

  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Contract PDF Content v1"));
  const sampleTitle = "Software Development Master Agreement";
  const sampleMetadataURI = "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const ChainLexFactory = await ethers.getContractFactory("ChainLexRegistry");
    registry = await ChainLexFactory.deploy();
    await registry.waitForDeployment();
  });

  describe("Anchoring Documents", function () {
    it("Should successfully anchor a document", async function () {
      const tx = await registry.anchorDocument(sampleHash, sampleTitle, sampleMetadataURI);
      await tx.wait();

      expect(await registry.isAnchored(sampleHash)).to.be.true;
      expect(await registry.getDocumentCount()).to.equal(1);
    });

    it("Should emit DocumentAnchored event", async function () {
      await expect(registry.anchorDocument(sampleHash, sampleTitle, sampleMetadataURI))
        .to.emit(registry, "DocumentAnchored")
        .withArgs(sampleHash, owner.address, (val: any) => typeof val === "bigint" || typeof val === "number", sampleTitle, sampleMetadataURI);
    });

    it("Should prevent duplicate document hash anchoring", async function () {
      await registry.anchorDocument(sampleHash, sampleTitle, sampleMetadataURI);

      await expect(
        registry.anchorDocument(sampleHash, sampleTitle, sampleMetadataURI)
      ).to.be.revertedWithCustomError(registry, "DocumentAlreadyExists");
    });

    it("Should revert on zero hash", async function () {
      const zeroHash = ethers.ZeroHash;
      await expect(
        registry.anchorDocument(zeroHash, sampleTitle, sampleMetadataURI)
      ).to.be.revertedWithCustomError(registry, "InvalidHash");
    });
  });

  describe("Verifying Documents", function () {
    it("Should return correct record details for anchored hash", async function () {
      await registry.connect(addr1).anchorDocument(sampleHash, sampleTitle, sampleMetadataURI);

      const [exists, docOwner, timestamp, title, metadataURI] = await registry.verifyDocument(sampleHash);

      expect(exists).to.be.true;
      expect(docOwner).to.equal(addr1.address);
      expect(timestamp).to.be.greaterThan(0);
      expect(title).to.equal(sampleTitle);
      expect(metadataURI).to.equal(sampleMetadataURI);
    });

    it("Should return non-existent state for unanchored hash", async function () {
      const unanchoredHash = ethers.keccak256(ethers.toUtf8Bytes("Unanchored Content"));
      const [exists, docOwner, timestamp, title, metadataURI] = await registry.verifyDocument(unanchoredHash);

      expect(exists).to.be.false;
      expect(docOwner).to.equal(ethers.ZeroAddress);
      expect(timestamp).to.equal(0);
      expect(title).to.equal("");
      expect(metadataURI).to.equal("");
    });
  });
});
