class FormatHelper {
    /**
     * 名稱轉換 - 串烤轉駝峰
     * @param {string} kebab 
     * @param {boolean} upperCamel transfer to upper camel
     */
    static formatKebabToCamel(kebab, upperCamel = true) {
        const Words = kebab.split('-');
        const formatCamel = name => `${name.replace(/^[a-z]{1}/, name[0].toUpperCase())}`;
        return Words.map((word, index) => index === 0 && !upperCamel ? word : formatCamel(word)).join('');
    }
}

module.exports = FormatHelper;