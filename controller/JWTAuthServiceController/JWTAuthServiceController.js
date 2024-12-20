/**
 * Summary : JWT Auth Service controller
 *
 * Description : Responsible to handle kore.ai provided web/mobile sdk client app requests for JWT authentication.
 *
 * @link   /JWT Auth Apis/
 * @author ESI CA BOT Implementation
 */

const MODULE_NAME = "JWTAuthServiceController";
const constants = require("../../constants/index");
const JWTAuthService = require("../../service/JWTAuthService");
const { logFn } = require("../../winston_config");

module.exports = {
  /**
   * Get the JWT Auth Token for Authentication.
   * @param {*} req  request from route.
   * @param {*} res response to be send to the api
   * @returns the response
   */
  async getJWTToken(req,res) {
    const FUNC_NAME = `getJWTToken`;
    let response;
    try {
      response = Object.create(constants.serverResponses.success);
      response.body = await JWTAuthService.generateToken(req);
    } catch (e) {
      logFn("error", __filename, `${MODULE_NAME} :: ${FUNC_NAME} :: `, e);
      response = Object.create(constants.serverResponses.serverError);
    }
    return res.status(response.status).send(response.body);
  },
};
