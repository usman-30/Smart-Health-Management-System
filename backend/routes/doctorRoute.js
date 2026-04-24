import express from "express";
import { doctorList, doctorDetails,doctorLogin} from "../controllers/doctorController.js";
const doctorRouter = express.Router();
doctorRouter.get("/list", doctorList);
doctorRouter.get("/:docId", doctorDetails);
doctorRouter.post("/login", doctorLogin);

export default doctorRouter;
