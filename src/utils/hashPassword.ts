import bcrypt from "bcryptjs"

export default (password: string)=>{
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}