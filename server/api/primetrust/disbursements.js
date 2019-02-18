const axios = require("axios");
const controller = {};

const authorizationHeaders = {
  Authorization: `Basic ${Buffer.from(
    `${process.env.PRIMETRUST_EMAIL}:${process.env.PRIMETRUST_PASSWORD}`
  ).toString("base64")}`
};

controller.list = async (req, res) => {
  try {
    let page = 1;
    let size = 10;
    if (req.query.page) {
      page = req.query.page;
    }
    if (req.query.size) {
      size = req.query.size;
    }

    const url = `${
      process.env.PRIMETRUST_URL
    }/disbursements?page[number]=${page}&page[size]=${size}`;
    const response = await axios(url, {
      headers: authorizationHeaders,
      timeout: 5000
    });
    if (response.status !== 200) {
      return null;
    }
    res.json({
      status: 1,
      data: {
        meta: response.data["meta"],
        data: response.data["data"]
      }
    });
  } catch (e) {
    res.json({
      status: 0,
      error: e.message
    });
  }
};

controller.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const url = `${process.env.PRIMETRUST_URL}/disbursements/${id}`;
    const response = await axios(url, {
      headers: authorizationHeaders,
      timeout: 5000
    });
    if (response.status !== 200) {
      return null;
    }
    res.json({
      status: 1,
      data: response.data["data"]
    });
  } catch (e) {
    res.json({
      status: 0,
      error: e.message
    });
  }
};

module.exports = controller;
