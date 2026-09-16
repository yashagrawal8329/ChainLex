import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying ChainLexRegistry smart contract...");

  const ChainLexRegistry = await ethers.getContractFactory("ChainLexRegistry");
  const registry = await ChainLexRegistry.deploy();
  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log(`ChainLexRegistry deployed to: ${contractAddress}`);

  // Export contract metadata to frontend if directory exists
  const deploymentInfo = {
    address: contractAddress,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
  };

  const frontendLibDir = path.join(__dirname, "../../frontend/src/lib");
  if (!fs.existsSync(frontendLibDir)) {
    fs.mkdirSync(frontendLibDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendLibDir, "contractAddress.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  const artifact = require("../artifacts/contracts/ChainLexRegistry.sol/ChainLexRegistry.json");
  fs.writeFileSync(
    path.join(frontendLibDir, "contractABI.json"),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("Exported contract address and ABI to frontend/src/lib/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
