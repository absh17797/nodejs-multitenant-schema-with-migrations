exports.getAll = async (req, res) => {
    console.log("req.db")
    const Vehicle = req.db.Vehicle;
    const data = await Vehicle.find();
    res.json(data);
};

exports.create = async (req, res) => {
    const Vehicle = req.db.Vehicle;
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.json(vehicle);
};