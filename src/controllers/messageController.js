const client = require("../config/whatsapp");
const { compileTemplate } = require("../utils/messageTemplates");

const sendMessage = async (req, res) => {
  try {
    const { phone, template, templateData, message: directMessage } = req.body;

    if (!phone || (!template && !directMessage)) {
      return res.status(400).json({
        status: false,
        message:
          "Phone number and either template or direct message are required",
      });
    }

    // Format the phone number
    const formattedPhone = phone.replace(/\D/g, "");

    // Check if the client is ready
    if (!client.info) {
      return res.status(400).json({
        status: false,
        message: "WhatsApp client is not ready",
      });
    }

    // Prepare the message
    let messageToSend;
    if (template) {
      try {
        messageToSend = compileTemplate(template, templateData);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: error.message,
        });
      }
    } else {
      messageToSend = directMessage;
    }

    // Send the message
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, messageToSend);

    res.status(200).json({
      status: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

const sendMessageMeal = async (req, res) => {
  try {
    const {
      phone,
      zonaWaktu,
      subBidang,
      judulPekerjaan,
      employeeCounts,
      employeeDetails,
      dropPoint,
      totalEmployees,
      timestamp,
    } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: false,
        message: "Phone number is required",
      });
    }

    // Validate required fields
    if (
      !zonaWaktu ||
      !subBidang ||
      !judulPekerjaan ||
      !employeeCounts ||
      !employeeDetails ||
      !dropPoint ||
      !timestamp
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields for meal order",
      });
    }

    // Validate employee counts and details match
    const categories = ["PLNIP", "IPS", "KOP", "RSU", "MITRA"];
    for (const category of categories) {
      if (typeof employeeCounts[category] !== "number") {
        return res.status(400).json({
          status: false,
          message: `Invalid employee count for ${category}`,
        });
      }
      if (!employeeDetails[category] && employeeCounts[category] > 0) {
        return res.status(400).json({
          status: false,
          message: `Missing employee details for ${category}`,
        });
      }
    }

    // Format the phone number
    const formattedPhone = phone.replace(/\D/g, "");

    // Check if the client is ready
    if (!client.info) {
      return res.status(400).json({
        status: false,
        message: "WhatsApp client is not ready",
      });
    }

    // Calculate total employees if not provided
    const calculatedTotal = Object.values(employeeCounts).reduce(
      (sum, count) => sum + count,
      0
    );
    if (!totalEmployees) {
      totalEmployees = calculatedTotal;
    } else if (totalEmployees !== calculatedTotal) {
      return res.status(400).json({
        status: false,
        message: "Total employees does not match sum of employee counts",
      });
    }

    // Prepare the message using pemesananMakanan template
    const templateData = {
      zonaWaktu,
      subBidang,
      judulPekerjaan,
      employeeCounts,
      employeeDetails,
      dropPoint,
      totalEmployees,
      timestamp,
      link: "https://example.com/confirm", // Add confirmation link
    };

    let messageToSend;
    try {
      messageToSend = compileTemplate("pemesananMakanan", templateData);
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    // Send the message
    const chatId = formattedPhone + "@c.us";
    await client.sendMessage(chatId, messageToSend);

    res.status(200).json({
      status: true,
      message: "Meal order message sent successfully",
    });
  } catch (error) {
    console.error("Error sending meal order message:", error);
    res.status(500).json({
      status: false,
      message: "Failed to send meal order message",
      error: error.message,
    });
  }
};

const getStatus = (req, res) => {
  try {
    const status = client.info ? "connected" : "disconnected";
    res.status(200).json({
      status: true,
      data: { status },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error getting status",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  sendMessageMeal,
  getStatus,
};
