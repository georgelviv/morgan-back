import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

export const ping = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({
    success: true
  });
});
