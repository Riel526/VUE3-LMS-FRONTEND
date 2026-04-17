import { Notify } from 'quasar'

export const renderToast = (status, message, caption) => {

    let formatCaption
    if (typeof caption === 'string') {
        formatCaption = caption
    }

    if (typeof caption === 'object') {
        const errors = Object.values(caption).flat()
        formatCaption = `<ul> 
            ${errors.map(err => (
                `<li>${err}</li>`
            ))}
        </ul>`
    }

    Notify.create({
        message: message,
        caption: formatCaption || caption,
        html: true,
        color: status === 'success' ? 'positive' : status === 'error' ? 'negative' : 'info',
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