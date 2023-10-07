/**
 * Generate a random key string. The key is 6 characters long and contains only uppercase letters and numbers.
 */

export function generateKey(length: number = 6, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let key = '';
    
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return key;
}
