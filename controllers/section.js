const Section = require("../models/section");

exports.getSections = (req, res, next) => {
  Section.find()
    .sort({ createdAt: 1 })
    .then((result) => {
      res.status(200).json({
        sections: result,
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.addsection = (req, res, next) => {
  const name = req.body.name;
  const section = new Section({ name: name });

  section
    .save()
    .then((result) => {
      return res.status(200).json({
        section: result,
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.editSection = (req, res, next) => {
  const name = req.body.name;

  const id = req.body.id;
  Section.findById(id)
    .then((section) => {
      section.name = name;
      return section.save();
    })
    .then((result) => {
      res.status(200).json({
        section: result,
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.deleteSection = (req, res, next) => {
  const id = req.params.id;
  Section.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({
        msg: "Successfully Deleted",
      });
    })
    .catch((err) => {
      throw err;
    });
};

