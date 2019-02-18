const express = require("express");
const contacts = require("./contacts");
const accounts = require("./accounts");
const contributions = require("./contributions");
const disbursements = require("./disbursements");
const accountCashTransfers = require("./account-cash-transfers");
const fundsTransfers = require("./funds-transfers");

const router = express.Router();

router.get("/contacts", contacts.list);
router.get("/contacts/:id", contacts.detail);
router.get("/contacts/:id/cip-checks", contacts.cipChecks);
router.get("/contacts/:id/aml-checks", contacts.amlChecks);
router.get("/accounts", accounts.list);
router.get("/accounts/custodial", accounts.custodialAccount);
router.get("/accounts/escrow", accounts.escrowAccount);
router.get("/accounts/:id", accounts.detail);
router.get("/accounts/custodial/balance", accounts.custodialAccountBalance);
router.get("/accounts/escrow/balance", accounts.escrowAccountBalance);
router.get("/contributions", contributions.list);
router.get("/contributions/:id", contributions.detail);
router.get("/disbursements", disbursements.list);
router.get("/disbursements/:id", disbursements.detail);
router.get("/account-cash-transfers", accountCashTransfers.list);
router.get("/account-cash-transfers/:id", accountCashTransfers.detail);
router.get("/funds-transfers", fundsTransfers.list);
router.get("/funds-transfers/:id", fundsTransfers.detail);

module.exports = router;
