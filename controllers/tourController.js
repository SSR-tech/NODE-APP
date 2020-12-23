const Tour = require('../Models/tourModel');
const APIFeatures = require('../Utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '-5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: ['Unable to find all tours', err.message]
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: ['Tour not found', err.message]
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: ['Unable to create tour', err.message]
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // this will send the newly updated document to the client
      runValidators: true // Validates if the newly entered data are same as the schema.
    });

    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: ['Unable to update tour', err.message]
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: ['No tour found to be deleted', err.message]
    });
  }
};
