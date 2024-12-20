const { verbiageBuilder } = require("./verbiageBuilder");
const constants = require("./constants/index");
const richCardTemplate = require("./templates.json");
module.exports = {
  populateBotResponse: function (
    vbResponse,
    responseId,
    messageDataWithBotUserSession
  ) {
    const verbiage_builder_resp = vbResponse;
    let entityStatus = messageDataWithBotUserSession.entity_status;
    let failedEntity = messageDataWithBotUserSession.failedEntity;
    let orderIdInput = "";
    let result = verbiage_builder_resp.filter(
      (ele) => ele.RESPONSE_ID === responseId
    );
    //hook to add custom events
    switch (responseId) {
      case "ESI_PHA_ORD_INFO_ASK_ORD_TITLE":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_CNFN_MSG":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_ASK_ORD_ID":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_ORD_ID_RESP":
        orderIdInput = entityStatus;
        let str = result[0].WEB_RESPONSE_MSG.replaceAll(
          "${order_status}",
          orderIdInput
        );
        result[0].WEB_RESPONSE_MSG = str;
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_ORD_FALLBACK":
        return msgTemplate(result);
      case "ESI_PHA_ORD_INFO_ASK_MEMBER_ID":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_CNFN_ERROR_MSG":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_MEMBER_ID_RESP":
        let memberIdInput = entityStatus;
        let memberStr = result[0].WEB_RESPONSE_MSG.replaceAll(
          "${member_status}",
          memberIdInput
        );
        result[0].WEB_RESPONSE_MSG = memberStr;
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_INVALID_MSG":
        // let failedEntityInput = failedEntity === "OrderId" ? "Order Id" : "Member Id";
        if (failedEntity !== null) {
          let failedEntityInputStr =
            failedEntity === "Order Id"
              ? result[0].WEB_RESPONSE_MSG.replaceAll(
                  "${dynamic_entity}",
                  failedEntity
                )
              : result[0].WEB_RESPONSE_MSG.replaceAll(
                  "${dynamic_entity}",
                  failedEntity
                );
          result[0].WEB_RESPONSE_MSG = failedEntityInputStr;
          return msgTemplate(result);
        }

      case "ESI_PHA_ORD_INFO_MAX_NO_ATTEMPTS_MSG":
        return msgTemplate(result);

      case "ESI_PHA_ORD_MGMT_ORD_DETAILS_TABLE":
        return msgTemplate(result);

      case "ESI_PHA_ORD_MGMT_ORD_DETAILS_QR":
        return msgTemplate(result);

      case "ESI_PHA_ORD_INFO_UNAUTHORIZED_ACCESS_MSG":
        return msgTemplate(result);
        
      default:
        return responseId;
    }
  },
  resetExcelData: function () {
    constants.verbiage_En_RespData = verbiageBuilder(
      "ESI_PHA_BOT_RESP_BUILDER_EN_CA.xlsx"
    );
  },
};
function msgTemplate(templateData) {
  const templateType = templateData[0]?.MEDIA_TYPE;
  let cardData = templateData[0]?.DATA;

  const dafaultTextTemplate = templateData[0].WEB_RESPONSE_MSG;

  switch (templateType) {
    case "TABLE":
      return selectRichCardTemplate(
        richCardTemplate.tableTemplate,
        cardData,
        templateType
      );
    case "QUICK_REPLIES":
      return selectRichCardTemplate(
        richCardTemplate.quickReplyTemplate,
        templateData,
        templateType
      );

    default:
      return dafaultTextTemplate;
  }
}

function selectRichCardTemplate(
  templateTypeFormat,
  templateData,
  templatetype
) {
  if (templatetype === "TABLE") {
    let obj = templateTypeFormat;
    obj.payload = JSON.parse(templateData);
    obj.payload["template_type"] = templatetype.toLowerCase();
    return JSON.stringify(obj);
  } else if (templatetype === "QUICK_REPLIES") {
    let obj = templateTypeFormat;
    let resultData = templateData;
    let quickreplyData = resultData.map((ele) => {
      return {
        content_type: "text",
        title: ele.BUTTON_LABEL,
        payload: ele.BUTTON_ID,
        image_url: "",
      };
    });
    obj.payload["quick_replies"] = quickreplyData;
    obj.payload["template_type"] = templatetype.toLowerCase();
    obj.payload["text"] = "Do You need to see the order Id Details?";
    return JSON.stringify(obj);
  }
}
