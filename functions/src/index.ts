import { setGlobalOptions } from "firebase-functions";
import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

export const ping = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true
  },
  () => {
  logger.info("Hello logs!", {structuredData: true});
  return {
    success: true
  };
});
