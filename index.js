const app = require('./server/server')
const port = process.env.PORT

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
