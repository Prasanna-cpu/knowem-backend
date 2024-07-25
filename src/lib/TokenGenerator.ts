import jwt from 'jsonwebtoken'

export function tokenGenerator():string{
    return Math.floor(10000000+Math.random()*90000000).toString();
}

const secret:string|undefined=process.env.SECRET
// console.log(secret)

export function generateAuthToken(tokenId:number):string{
    const jwtPayload={tokenId}
    // return jwt.sign(jwtPayload,)
    // @ts-ignore
    return jwt.sign(jwtPayload,secret,{
        algorithm:"HS256",
        noTimestamp:true
    })


}