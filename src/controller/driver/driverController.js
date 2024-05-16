const mongoose = require("mongoose");
const Driver = require("../../model/drivers/driverSchema");

class DriverController {
    constructor() {}

    async createNewDriver(req, res, next) {
        try {
          const {name, bloodgroup, email, phone, drivingNo} = req.body;
          const driverObj = ({
            _id: new mongoose.Types.ObjectId,
            name: name,
            bloodgroup: bloodgroup,
            email: email,
            phone: phone,
            drivingNo: drivingNo
          });
          const driverData = await driverObj.save();
          return res.status(201).json({message: "New driver added", data: driverData})
        } catch (error) {
            next(error)
        }
    }
    
    async getDrivers(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const drivers = await Driver.find()
                .limit(limit)
                .skip((page-1)*limit)
                .sort({createdAt: -1});
            return res.status(200).json(drivers)
        } catch (error) {
            next(error)
        }
    }

    async searchDriver(req, res, next) {
        try {
            // Construct the search term based on the provided search key
            const searchTerm = req.query.searchKey
            ? {
                $or: [{ name: { $regex: req.query.searchKey, $options: "i" } }, { email: { $regex: req.query.searchKey, $options: "i" } }],
                }
            : {};
            // Retrieve cars matching the search term, sorted by creation date in descending order,
            // and paginated based on the specified page and limit
            const drivers = await Driver.find(searchTerm)
                .sort({ createdAt: -1 })
                .skip(limit * (page - 1))
                .limit(limit);
            // Send the array of cars as the response
            return res.status(200).json(drivers);
        } catch (error) {
            next(error)
        }
    }

    async updateDriverDetails(req, res, next) {
        try {
            
        }
        catch(error) {
            next(error)
        }
    }
}
module.exports = new DriverController()