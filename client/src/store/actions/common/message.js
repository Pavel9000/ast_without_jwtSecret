

export function message(messageType, messageText) {
    return {
        type: 'MESSAGE_MESSAGE',
        messageType,
        messageText
    }
}
