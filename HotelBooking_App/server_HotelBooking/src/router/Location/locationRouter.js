import express from "express";
import { deleteLocation, getLocationAll, getLocationById, PostLocation, updateLocation } from "../../controller/Location/locationController.js";

const routerLocation = express.Router();
routerLocation.get("/location", getLocationAll)
routerLocation.get("/location/:id", getLocationById)
routerLocation.post("/location", PostLocation)
routerLocation.put("/location/:id", updateLocation)
routerLocation.delete("/location/:id", deleteLocation)

export default routerLocation;