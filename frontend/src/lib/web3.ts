import { ethers } from "ethers";
import contractABI from "./contractABI.json";
import contractAddressConfig from "./contractAddress.json";

export const CONTRACT_ADDRESS = contractAddressConfig.address;

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
  return new ethers.JsonRpcProvider("http://127.0.0.1:8545");
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
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
}

export async function anchorOnChain(docHashBytes32: string, title: string, metadataURI: string) {
  const signer = await getSigner();
  if (!signer) {
    throw new Error("No Web3 Wallet detected. Please connect MetaMask or an Ethereum provider.");
  }
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
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
    console.warn("Failed to query on-chain node directly. Falling back to local verification state.", error);
    return {
      exists: false,
      owner: ethers.ZeroAddress,
      timestamp: 0,
      title: "",
      metadataURI: "",
    };
  }
}
