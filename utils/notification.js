const { getMessaging } = require("firebase-admin/messaging");

const sendNotification = async (tokenDevice, title, desc) => {
  try {
    const message = getMessaging();
    console.log("Tokn DEVICE", tokenDevice);
    let result = await message.send({
      token: tokenDevice,
      data: {
        title: title,
        body: desc
      }
    });
    return result;
  } catch (error) {
    console.log("Error", error.message);
  }
};

module.exports = { sendNotification };
