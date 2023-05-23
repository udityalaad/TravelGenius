const emailPattern = "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$";
const urlPattern = "^(http|https|ftp):\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-.,@?^=%&:/~+#]*[\\w\\-@?^=%&/~+#])?$";
const passwordPattern = "^(?=.*[!@#$%^&*(),.?:{}|<>])[A-Za-z0-9!@#$%^&*(),.?:{}|<>]{8,20}$";

module.exports = {
    emailPattern,
    urlPattern,
    passwordPattern
};