import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import type { Express } from "express";

export function setupSwagger(app: Express, port: string | number) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Agentic DeFi Flow API",
        version: "1.0.0",
        description: "API for the Synthesis hackathon agentic DeFi project",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
    },
    apis: ["./src/*.ts"],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}