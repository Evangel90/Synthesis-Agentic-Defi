import { ZgFile, Indexer } from "@0glabs/0g-ts-sdk";
import { createRequire } from "module";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import dotenv from "dotenv";
dotenv.config();


const require = createRequire(import.meta.url);
const { ethers } = require("ethers");

const INDEXER_RPC = "https://indexer-storage-testnet-turbo.0g.ai";
const EVM_RPC = "https://evmrpc-testnet.0g.ai";

export interface ExecutionLog {
  timestamp: string;
  userIntent: string;
  chain: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  expectedAmountOut: string;
  transactionHash: string;
  delegator: string;
  agentReasoning: string;
}

export class ZeroGService {
  private indexer: Indexer;
  private signer: any;

  constructor() {
    const privateKey = process.env.AGENT_PRIVATE_KEY as string;
    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    this.signer = new ethers.Wallet(privateKey, provider);
    this.indexer = new Indexer(INDEXER_RPC);
  }

  async uploadExecutionLog(log: ExecutionLog): Promise<string> {
    const tmpFile = join(tmpdir(), `og-log-${Date.now()}.json`);
    try {
      const content = JSON.stringify(log, null, 2);
      writeFileSync(tmpFile, content, "utf-8");

      const file = await ZgFile.fromFilePath(tmpFile);
      const [tree, treeErr] = await file.merkleTree();
      if (treeErr) throw new Error(`Merkle tree error: ${treeErr}`);

      const rootHash = tree!.rootHash();
      console.log(`📦 Uploading execution log to 0G Storage... Root: ${rootHash}`);

      const [tx, uploadErr] = await this.indexer.upload(file, EVM_RPC, this.signer);
      if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);

      console.log(`✅ Execution log stored on 0G. Root hash: ${rootHash}`);
      return rootHash!;
    } catch (error: any) {
      console.error("0G Storage upload failed (non-critical):", error.message);
      return "";
    } finally {
      try { unlinkSync(tmpFile); } catch {}
    }
  }
}