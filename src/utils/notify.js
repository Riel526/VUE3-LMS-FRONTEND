import { Notify } from 'quasar'

export const renderToast = (message, status, caption) => {
    Notify.create({
        message: message,
        caption: caption,
        color: status === 'success' ? 'primary' : status === 'error' ? 'negative' : 'secondary',
        timeout: 4000,
        actions: [
            {
                label: 'Close',
                color: 'white',
                handler: () => {}
            }
        ]
    })
}