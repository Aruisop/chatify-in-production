import express from "express";
import { getAllContacts } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesByUserId } from "../controllers/message.controller.js";
import { sendMessage } from "../controllers/message.controller.js";
import { getChatPartners } from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();

router.use(arcjetProtection,protectRoute);

router.get("/contacts", getAllContacts);
//on postman reqs 2:59:34---> errored, as I logged out initially
// and wasnt able to api test contacts
//order is very imp, this is the only order.
// so that the reqs get rate-limited first and then authenticated
// this is actually more eff since we dont want unauth req to get blocked by rate limiting
//before hitting the auth middleware.
router.get("/chats",getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;