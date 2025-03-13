// Bootstrap file for MidwayJS application
const { Bootstrap } = require('@midwayjs/bootstrap')

// Start the application
Bootstrap.run()
  .then(() => {
    console.log('HDC Install Server started successfully')
  })
  .catch((err) => {
    console.error('Failed to start HDC Install Server', err)
    process.exit(1)
  })
