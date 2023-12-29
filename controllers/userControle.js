const COURT = require("../models/courtSchenma");
const COURT_SCHEDULES = require("../models/courtTimingSchema");
const USER = require("../models/userSchema");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { response } = require("express");

const getBookingPage = (req, res) => {
  try {
    COURT.findOne({ _id: req.query.id }).then((resp) => {
      res.status(200).json({ data: resp });
    });
  } catch (error) {}
};

const getAvailableSlots = (req, res) => {
  try {
    COURT_SCHEDULES.aggregate([
      {
        $match: {
          courtId: new ObjectId(req.query.courtId),
          date: new Date(req.query.date.split("T")[0]),
          "slot.id": { $gt: parseInt(req.query.currentHour) },
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "courts",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          courts: 1,
          bookedBy: 1,
        },
      },
    ])
      .then((resp) => {
        res.status(200).json({ resp });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {}
};

const getMyBookings = (req, res) => {
  const currentDate = new Date();
  const slotId = currentDate.getHours();
  currentDate.setUTCHours(0, 0, 0, 0);
  console.log(currentDate, slotId);

  try {
    COURT_SCHEDULES.aggregate([
      {
        $match: {
          bookedBy: new ObjectId(req.userId),
          $expr: {
            $or: [
              { $gt: ["$date", currentDate] },
              {
                $and: [
                  { $eq: ["$date", currentDate] },
                  { $gt: ["$slot.id", slotId] },
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "courts",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          courts: { $arrayElemAt: ["$courts", 0] },
        },
      },
    ]).then((resp) => {
      res.status(200).json(resp);
    });
  } catch (error) {}
};

const getPreviousBookings = (req, res) => {
  const currentDate = new Date();
  const slotId = currentDate.getHours();
  currentDate.setUTCHours(0, 0, 0, 0);
  console.log(currentDate, slotId);
  try {
    COURT_SCHEDULES.aggregate([
      {
        $match: {
          bookedBy: new ObjectId(req.userId),
          $expr: {
            $or: [
              { $lt: ["$date", currentDate] },
              {
                $and: [
                  { $eq: ["$date", currentDate] },
                  { $lt: ["$slot.id", slotId] },
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "courts",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          courts: { $arrayElemAt: ["$courts", 0] },
        },
      },
    ]).then((resp) => {
      res.status(200).json(resp);
    });
  } catch (error) {}
};

const forgetpassword = (req, res) => {
  try {
    const { email } = req.body;
    USER.findOne({ email: email }).then((user) => {
      console.log(user);
      if (!user) {
        return res.send({ status: "user not existed" });
      }
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
          expiresIn: "1d",
        });
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "slook.in.here@gmail.com",
            pass: "guwp zcuj nmrr cbfp",
          },
        });

        const info = transporter.sendMail({
          from: "slook.in.here@gmail.com",
          to: `${user.email}`,
          subject: "Reset your password✔",
          text: `http://localhost:3000/reset-password/${user._id}/${token}`,
          html: `<b>use this link to reset your password:http://localhost:3000/reset-password/${user._id}/${token}</b>`,
        });
        console.log("Message sent: %s", info.messageId);

        return res.send({ staus: "success" });
      }
    });
  } catch (error) {}
};

const resetPassword = (req, res) => {
  try {
    req.query.id;
    const { token, login, id } = req.body;
    const { password } = login;

    jwt.verify(token, process.env.JWT, (err, decoded) => {
      if (err) {
        return res.json({ status: "Error with token" });
      } else {
        bcrypt.hash(password, 10).then((hash) => {
          USER.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((resp) => res.send({ status: "success" }))
            .catch((resp) => res.send({ status: err }));
        });
      }
    });
  } catch (error) {}
};

const getThisScheduleData = (req, res) => {
  try {
    const { id } = req.query;
    COURT_SCHEDULES.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          bookedBy: new ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "court",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          cancellation: 1,
          court: { $arrayElemAt: ["$court", 0] },
        },
      },
    ]).then((resp) => {
      res.status(200).json(resp);
    });
  } catch (error) {}
};

const cancelBooking = async (req, res) => {
  try {
    date = new Date();
    const currentDate = date.getDate();
    const { id } = req.body;
    const Schedule = await COURT_SCHEDULES.find({ _id: id });
    const bookingDate = Schedule[0].date.getDate();
    const orderDetailes = Schedule[0].orderDetailes[0];
    if (bookingDate > currentDate) {
      update = await COURT_SCHEDULES.findByIdAndUpdate(
        { _id: id },
        {
          $set: { bookedBy: null },
          $push: { cancellation: { _id: req.userId } },
        }
      );
      console.log(update);
      return res
        .status(200)
        .json({ message: "scheduled cancelled successfully" });
    } else {
      return res.status(200).json({ message: "can't cancell this schedule" });
    }
  } catch (error) {
    res.send(error);
  }
};

const getCancelldBookings = (req, res) => {
  try {
    const id = req.userId;
    console.log(id);
    COURT_SCHEDULES.aggregate([
      {
        $match: {
          cancellation: { $elemMatch: { _id: id } },
        },
      },
      {
        $lookup: {
          from: "courts",
          localField: "courtId",
          foreignField: "_id",
          as: "courts",
        },
      },
      {
        $project: {
          _id: 1,
          date: 1,
          slot: 1,
          cost: 1,
          cancellation: 1,
          courts: { $arrayElemAt: ["$courts", 0] },
        },
      },
    ])
    .then((response) => {
      res.status(200).json(response);
      console.log(response, "eeeeeeeeeeeeeeeeeeeee");
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getBookingPage,
  getAvailableSlots,
  getMyBookings,
  getPreviousBookings,
  forgetpassword,
  resetPassword,
  getThisScheduleData,
  cancelBooking,
  getCancelldBookings,
};
