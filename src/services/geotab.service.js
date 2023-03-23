const fs = require('fs-extra');
const pth = require('path');

const API = require('mg-api-js');
require('dotenv').config();

const {
  GEOTAB_USERNAME: userName, //Usario o correo 
  GEOTAB_PASSWORD: password, //Contraseña
  GEOTAB_DB: database, //Base de datos
  GEOTAB_SERVER: path //Servidor "https://my.geotab.com/"
} = process.env;

const filePath = pth.resolve(__dirname, '../.session');

class GeotabAPI extends API {
  constructor() {
    const authentication = {
      credentials: {
        database,
        userName,
        password
      },
      path
    };
    super(authentication);
    (async () => {
      if (await fs.pathExists(filePath)) {
        const sessionId = await fs.readFile(filePath, { encoding: 'utf-8' });
        this._helper.cred.sessionId = sessionId;
      }
    })
  }

  async authenticate() {
    try {
      const resp = await super.authenticate();
      const { sessionId } = resp.credentials;
      this._helper.cred.sessionId = sessionId;
      await fs.writeFile(filePath, sessionId, { encoding: 'utf-8' });
    }
    catch (ex) {
      throw ex;
    }
  }

  async call(method, params) {
    try {
      if (!this._helper.cred.sessionId && method !== 'Authenticate') {
        await this.authenticate();
      }
      return await super.call(method, params);
    }
    catch (ex) {
      if (ex.message.includes('Incorrect login credentials')) {
        await this.authenticate();
        return await this.call(method, params);
      }
      else {
        throw ex;
      }
    }
  }

  async multiCall(calls) {
    try {
      if (!this._helper.cred.sessionId) {
        await this.authenticate();
      }
      return await super.multiCall(calls);
    }
    catch (ex) {
      if (ex.message.includes('Incorrect login credentials')) {
        await this.authenticate();
        return await super.multiCall(calls);
      }
      else {
        throw ex;
      }
    }
  }
}

module.exports = new GeotabAPI();