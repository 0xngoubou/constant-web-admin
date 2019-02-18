const axios = require("axios");
const auth = {};

const profile = async token => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.Result;
  } catch (e) {
    return null;
  }
};

auth.me = async (req, res) => {
  try {
    const token = req.headers["x-token"] || req.session.token;
    const user = await profile(token);
    res.json({
      status: 1,
      data: user
    });
  } catch (e) {
    res.json({
      status: 0,
      error: e.response ? e.response.data.Error.Message : e.message
    });
  }
};

auth.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await axios.post(`${process.env.API_URL}/api/auth/login`, {
      Email: email,
      Password: password
    });

    const token = response.data.Result.Token;
    const user = await profile(token);
    if (user.RoleID !== 1) {
      res.json({
        status: 0,
        error: "invalid credentials"
      });
      return;
    }
    req.session.token = token;

    res.json({
      status: 1,
      data: token
    });
  } catch (e) {
    res.json({
      status: 0,
      error: e.response ? e.response.data.Error.Message : e.message
    });
  }
};

auth.logout = async (req, res) => {
  req.logout();
  req.session = null;
  res.json({
    status: 1
  });
};

module.exports = auth;
