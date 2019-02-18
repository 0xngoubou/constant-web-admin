import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import { inject, observer } from "mobx-react";

const styles = theme => ({
  backdropRoot: {
    backgroundColor: "black"
  },
  dialogActionsRoot: {
    padding: `0 ${theme.spacing.unit * 3}px 0`,
    margin: `${theme.spacing.unit * 1.5}px 0`
  },
  dialogActionsButton: {
    margin: 0
  }
});

@inject("store")
@observer
class DialogLoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleTextChange = evt => {
    const field = evt.target.name;
    const value = evt.target.value;
    this.setState(() => ({ [field]: value }));
  };

  handleLogin = evt => {
    const { onLogin } = this.props;
    const { email, password } = this.state;
    onLogin &&
      onLogin({
        email,
        password
      });
  };

  render() {
    const { classes, store } = this.props;
    return (
      <form noValidate autoComplete="off" onSubmit={this.handleLogin}>
        <Dialog
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          open={!store.auth.isAuthenticated}
          BackdropProps={{
            classes: {
              root: classes.backdropRoot
            }
          }}
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleTextChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleTextChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions classes={{ root: classes.dialogActionsRoot }}>
            <Button
              className={classes.dialogActionsButton}
              onClick={this.handleLogin}
              color="primary"
              variant="outlined"
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    );
  }
}

DialogLoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DialogLoginForm);
