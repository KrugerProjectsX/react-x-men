import CryptoJS from "crypto-js";
export const encode= (password)=>{
    
    let passwordEncode= CryptoJS.AES.encrypt(password,"@atgksx2024");
    return passwordEncode;
}

export const decode= (password)=>{
    let bytes= CryptoJS.AES.decrypt(password,"@atgksx2024");
    let passwordDecode= bytes.toString(CryptoJS.enc.Utf8);
    return passwordDecode;
}
