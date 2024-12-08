const client = require('../config/whatsapp');
const { compileTemplate } = require('../utils/messageTemplates');

const sendMessage = async (req, res) => {
    try {
        const { phone, template, templateData, message: directMessage } = req.body;

        if (!phone || (!template && !directMessage)) {
            return res.status(400).json({
                status: false,
                message: 'Phone number and either template or direct message are required'
            });
        }

        // Format the phone number
        const formattedPhone = phone.replace(/\D/g, '');
        
        // Check if the client is ready
        if (!client.info) {
            return res.status(400).json({
                status: false,
                message: 'WhatsApp client is not ready'
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
                    message: error.message
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
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

const getStatus = (req, res) => {
    try {
        const status = client.info ? 'connected' : 'disconnected';
        res.status(200).json({
            status: true,
            data: { status }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error getting status',
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getStatus
};