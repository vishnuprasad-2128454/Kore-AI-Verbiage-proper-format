/**
 * Summary : Ticketing Tool Service controller
 *
 * Description : Responsible to handle all sort of unattended user queries as tickets in external ticketing tool system such as servicenow etc.
 *
 * @link   /Ticketing Tool Apis/
 * @author ESI CA BOT Implementation
 */


const MODULE_NAME = 'TicketingToolServiceController';
const constants = require("../../constants/index");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
    
    async getTicket(){ 
        
    }
}
