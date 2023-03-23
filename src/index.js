const geotabService = require("./services/geotab.service.js")
const express = require('express')
const app = express()

let lstStatus;

app.get('/', async function(req, res) {
  let info = await getDeviceStatusInfo()
  res.send(info)
})

const getDeviceStatusInfo = async () => {
    try {
        lstStatus = await geotabService.call('Get', {
            typeName: "DeviceStatusInfo",
            resultsLimit: 10
      });
      return lstStatus;
    } catch (error) {
      console.error(error);
    }
}

app.listen(3000)