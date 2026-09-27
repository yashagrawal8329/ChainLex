import { ethers } from "ethers";
import contractABI from "./contractABI.json";
import contractAddressConfig from "./contractAddress.json";
import { fetchChainConfig } from "./api";

export const DEFAULT_CONTRACT_ADDRESS = contractAddressConfig.address;
export const SEPOLIA_CHAIN_ID = 11155111;
export const FREE_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

let runtimeAddress = DEFAULT_CONTRACT_ADDRESS;
let runtimeRpc = FREE_RPC_URL;
let runtimeChainId = Number(contractAddressConfig.chainId || SEPOLIA_CHAIN_ID);

export function getContractAddress(): string {
  return runtimeAddress;
}

export async function hydrateChainConfig() {
  const cfg = await fetchChainConfig();
  if (cfg?.contract_address) runtimeAddress = cfg.contract_address;
  if (cfg?.rpc_url) runtimeRpc = cfg.rpc_url;
  if (cfg?.chain_id) runtimeChainId = cfg.chain_id;
  return cfg;
}

export async function calculateBrowserSHA256(file: File): Promise<{ hashHex: string; docHashBytes32: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const docHashBytes32 = `0x${hashHex}`;
  return { hashHex, docHashBytes32 };
}

export function getProvider(): ethers.Provider {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return new ethers.JsonRpcProvider(runtimeRpc);
}

export async function getSigner(): Promise<ethers.Signer | null> {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner();
  }
  return null;
}

export function getReadOnlyContract(): ethers.Contract {
  const provider = getProvider();
  return new ethers.Contract(getContractAddress(), contractABI, provider);
}

export async function ensureSepolia(): Promise<void> {
  if (typeof window === "undefined" || !(window as any).ethereum) return;
  const provider = (window as any).ethereum;
  const current = await provider.request({ method: "eth_chainId" });
  const wanted = `0x${runtimeChainId.toString(16)}`;
  if (current === wanted) return;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: wanted }],
    });
  } catch (err: any) {
    if (err?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: wanted,
            chainName: "Sepolia",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [runtimeRpc],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          },
        ],
      });
    }
  }
}

export async function anchorOnChain(docHashBytes32: string, title: string, metadataURI: string) {
  await ensureSepolia();
  const signer = await getSigner();
  if (!signer) {
    throw new Error("No Web3 Wallet detected. Please connect MetaMask.");
  }
  const address = getContractAddress();
  if (!address || address === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contract not deployed yet. Deploy ChainLexRegistry in Remix IDE first.");
  }
  const contract = new ethers.Contract(address, contractABI, signer);
  const tx = await contract.anchorDocument(docHashBytes32, title, metadataURI);
  const receipt = await tx.wait();
  return receipt;
}

export async function verifyOnChain(docHashBytes32: string) {
  try {
    const contract = getReadOnlyContract();
    const result = await contract.verifyDocument(docHashBytes32);
    return {
      exists: result.exists,
      owner: result.owner,
      timestamp: Number(result.timestamp),
      title: result.title,
      metadataURI: result.metadataURI,
    };
  } catch (error) {
    console.warn("Failed to query on-chain node.", error);
    return {
      exists: false,
      owner: ethers.ZeroAddress,
      timestamp: 0,
      title: "",
      metadataURI: "",
    };
  }
}
