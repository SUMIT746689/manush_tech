import { createSmsQueueTableHandler } from "./createSmsQueueTableHandler.js";

export const sentSmsQueue = (info, a, b, school_id, index) => {
  console.log({ info, a, b });
  const { user_id, phone, created_at } = info;
  createSmsQueueTableHandler({ user_id, contacts: phone, sms_text: b, submission_time: created_at, school_id, index });
}