import express from "express";
import {chatBot} from "../controllers/chatBotController.js";

import authAdmin from "../middlewares/authAdmin.js";

const chatRouter = express.Router();

chatRouter.post("/", chatBot);
export default chatRouter;
