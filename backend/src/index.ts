import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import { getQuote } from "./controllers/QuoteController";
import { redeemSwap } from "./controllers/RedeemController";
import { getAgentInfo } from "./controllers/AgentController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app, port);

/**
 * @openapi
 * /api/quote:
 *   get:
 *     summary: Get a swap quote from Uniswap V3
 *     parameters:
 *       - in: query
 *         name: chain
 *         required: true
 *         schema:
 *           type: string
 *           enum: [base, celo, baseSepolia, celoSepolia]
 *       - in: query
 *         name: tokenIn
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tokenOut
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amountIn
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: decimalsIn
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: decimalsOut
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fee
 *         schema:
 *           type: integer
 *           default: 3000
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/api/quote", getQuote);
app.get("/api/agent", getAgentInfo);

/**
 * @openapi
 * /api/redeem:
 *   post:
 *     summary: Execute a delegated swap on Uniswap V3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [chain, tokenIn, tokenOut, amountIn, decimalsIn, delegation, delegator]
 *             properties:
 *               chain:
 *                 type: string
 *                 enum: [base, celo, baseSepolia, celoSepolia]
 *               tokenIn:
 *                 type: string
 *               tokenOut:
 *                 type: string
 *               amountIn:
 *                 type: string
 *               decimalsIn:
 *                 type: integer
 *               delegation:
 *                 type: object
 *               delegator:
 *                 type: string
 *               fee:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 */
app.post("/api/redeem", redeemSwap);

app.get("/", (req, res) => {
  res.send("Agentic DeFi Flow is alive.");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[swagger]: Documentation available at http://localhost:${port}/api-docs`);
});
