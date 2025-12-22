import { onCall } from "firebase-functions/https";

export const pingFn = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true
  },
  () => {
  return {
    success: 2
  };
});