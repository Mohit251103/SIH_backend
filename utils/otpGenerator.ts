const otp = () => {
    let res = "";
    for(let i=0; i<6; i++){
        res += Math.floor(Math.random() * 9);
    }
    return res;
}

export default otp;