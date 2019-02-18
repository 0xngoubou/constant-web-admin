const axios = require("axios");
const controller = {};

controller.list = async (req, res) => {
  try {
    const token = req.headers["x-token"] || req.session.token;
    let page = 1;
    let size = 10;
    if (req.query.page) {
      page = req.query.page;
    }
    if (req.query.size) {
      size = req.query.size;
    }

    let url = `${
      process.env.API_URL
    }/api/admin/users?page=${page}&limit=${size}`;

    if (req.query.verified_level) {
      url = `${url}&verified_level=${req.query.verified_level}`;
    }

    if (req.query.keywords) {
      url = `${url}&keywords=${req.query.keywords}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    });

    res.json({
      status: 1,
      data: {
        count: response.data.Result["Total"],
        data: response.data.Result["Users"]
      }
    });
  } catch (e) {
    res.json({
      status: 0,
      error: e.message
    });
  }
};

controller.submit = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers["x-token"] || req.session.token;
    const response = await axios.post(
      `${process.env.API_URL}/api/admin/primetrust/submit`,
      {
        UserID: parseInt(userId)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    res.json({ status: 1, data: response.data.Result });
  } catch (e) {
    res.json({
      status: 0,
      error: e.response ? e.response.data.Error.Message : e.message
    });
  }
};

controller.discard = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers["x-token"] || req.session.token;
    const response = await axios.post(
      `${process.env.API_URL}/api/admin/primetrust/discard`,
      {
        UserID: parseInt(userId)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({ status: 1, data: response.data.Result });
  } catch (e) {
    res.json({
      status: 0,
      error: e.response ? e.response.data.Error.Message : e.message
    });
  }
};

controller.ban = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers["x-token"] || req.session.token;
    const response = await axios.post(
      `${process.env.API_URL}/api/admin/user/ban`,
      {
        UserID: parseInt(userId)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({ status: 1, data: response.data.Result });
  } catch (e) {
    res.json({
      status: 0,
      error: e.response ? e.response.data.Error.Message : e.message
    });
  }
};

module.exports = controller;
