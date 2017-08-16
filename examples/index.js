let express = require('express')
let rewrite = require('express-urlrewrite')
let webpack = require('webpack')
let webpackDevMiddleware = require('webpack-dev-middleware')
let WebpackConfig = require('./webpack.config')

let app = express()

app.all('/api/*', (req, res) => { // Fake API response
  setTimeout(() => { res.status(200).json({ message: 'Success! ' + req.method +  ' ' + req.url }) }, 1000)
})

app.use(webpackDevMiddleware(webpack(WebpackConfig), {
  publicPath: '/__build__/',
  stats: {
    colors: true,
  },
}))

let fs = require('fs')
let path = require('path')

fs.readdirSync(__dirname).forEach((file) => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory())
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'))
})

app.use(express.static(__dirname))


app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})
