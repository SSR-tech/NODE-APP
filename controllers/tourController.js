const Tour = require('../Models/tourModel');
const APIFeatures = require('../Utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../Utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '-5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
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

  next();
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID'));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });

  next();
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  {
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour
      }
    });
  }
  next();
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // this will send the newly updated document to the client
    runValidators: true // Validates if the newly entered data are same as the schema.
  });

  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID'));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
  next();
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(404, 'No tour found with that ID'));
  }

  res.status(204).json({
    status: 'Success',
    data: null
  });
  next();
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' }
    //   }
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  });
  next();
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'Success',
    results: plan.length,
    data: {
      plan
    }
  });
  next();
});
