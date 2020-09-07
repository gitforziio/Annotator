var key = CryptoJS.enc.Hex.parse("54404191395b628451fd972f720f56bd76c2d907210f85d67580e59e36d5cadd");
var iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");


function AES_Decrypt(word) {
    var srcs = word;
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}

AES_Decrypt('3kT22epacAPCde5ILcuiDnHMVAP9nHKMJOHyKH0AuM4SW0oE1B/JV7gfdGfFQdMz66tKobxSzpPEK1rknUGOJpDlpiyk5QbM9Y1he7Q6sCrDKo0D5D8j3MQ4PTWJOSRL')
