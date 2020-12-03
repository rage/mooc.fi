export function validateEmail(
    value: string,
): value is string {
    const mailRegex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    return mailRegex.test(value)
}

export function validatePassword(
    value: string,
): value is string {
    const passwordRegex = /^[A-Za-z]\w{6,64}$/

   return passwordRegex.test(value)
}