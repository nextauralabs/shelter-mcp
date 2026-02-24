import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerFinancialCheckup } from './financial-checkup.js';
import { registerSpendingReview } from './spending-review.js';
import { registerPlanAPurchase } from './plan-a-purchase.js';

export function registerPrompts(server: McpServer) {
  registerFinancialCheckup(server);
  registerSpendingReview(server);
  registerPlanAPurchase(server);
}
