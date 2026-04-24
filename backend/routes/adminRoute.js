import express from "express";
import {
  addDoctor,
  allDcotors,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { getDoctorAvailability, setDoctorAvailability } from "../controllers/doctorController.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDcotors);
adminRouter.post("/set-availability", authAdmin, setDoctorAvailability);
adminRouter.get("/availability/:doctorId", getDoctorAvailability);

export default adminRouter;
