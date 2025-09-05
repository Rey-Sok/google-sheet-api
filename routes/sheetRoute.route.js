import express from 'express';
import { getAllData, getUniqueProvinces, getDistrictsByProvince, getSchoolsByDistrict, getUniqueDistricts,getUniqueSchools,getByProvinces,getByDistricts,getBySchools } from '../controllers/sheetController.controller.js';

// Create a new router instance
const router = express.Router();

// Define the route to get all data from the Google Sheet
router.get('/allData', getAllData);

// Define the route to get unique provinces
router.get('/provinces', getUniqueProvinces);

// Define the route to get unique districts
router.get('/districts', getUniqueDistricts);

// Define the route to get unique schools
router.get('/schools', getUniqueSchools);

// Define the route to get by provinces
router.get('/provinces/:province', getByProvinces);

// Define the route to get by districts
router.get('/districts/:district', getByDistricts);

// Define the route to get by schools
router.get('/schools/:school', getBySchools);

// Define the route to get districts based on a selected province
router.get('/provinces/:province/districts', getDistrictsByProvince);

// Define the route to get schools based on a selected district
router.get('/districts/:district/schools', getSchoolsByDistrict);

export default router;
