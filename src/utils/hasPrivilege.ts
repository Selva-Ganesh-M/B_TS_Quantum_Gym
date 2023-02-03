// method to check whether the user has privilage to do the requested action

import { customError } from "./customError"

export default (option1: string, option2:string) => {
    if (option1!==option2) throw new customError(409, "update failed: You can only update your details only.")
}