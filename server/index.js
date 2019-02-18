require("dotenv").load()

const { parse } = require("url")
const express = require("express")
const next = require("next")
const mobxReact = require("mobx-react")
const compression = require("compression")
const cookieSession = require("cookie-session")
const bodyParser = require("body-parser")
const passport = require("passport")

const port = parseInt(process.env.APP_PORT, 10) || 5000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev, dir: "./" })
const handle = app.getRequestHandler()

const initApiRoutes = require('./api')

mobxReact.useStaticRendering(true);

app
  .prepare()
  .then(() => {
    const server = express()
    if (!dev) server.use(compression())
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cookieSession({
      name: 'session',
      keys: [process.env.SECRET],
      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    server.use(passport.initialize());
    server.use(passport.session());
    
    initApiRoutes(server)

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => {
      const parsedUrl = parse(req.url, true)
      return handle(req, res, parsedUrl)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
