import {z, object, string, TypeOf, number} from "zod"

// signup
const signup = object({
    body: object({
        // username
        username: string({
            required_error: "username is a required field."
        }),

        // fullname
        fullname: string({
            required_error: "username is a required field."
        }),
        
        // email
        email: string({
            required_error: "Email is a required field",
          }).email("Invalid email addresss."),

        // password
        password: string({required_error: "password is a required field."})
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),
        
        // confirmPassword
        confirmPassword: string({required_error: "password is a required field."})
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),


        // image
        image: string({
            required_error: "Email is a required field",
          }),

        // age
        age: number({required_error: "Age is a required field"}),

        // gender
        gender: string({
          required_error: "Email is a required field",
        })

    }).refine((data)=>{
      if (data.password!=data.confirmPassword){
        return false
      }
      return true
    }, {message: "confirmPassword must match the password"})
  })
  export type TAuthSignURequest = TypeOf<typeof signup>
  
  
  // google signup
  const googleSignUp = object({
      body: object({
          // username
          username: string({
              required_error: "username is a required field."
          }),
  
          // email
          email: string({
              required_error: "Email is a required field",
            }).email("Invalid email addresss."),
  
          // image
          image: string({
              required_error: "Email is a required field",
            }).optional(),
      })
    })

// login   
const login = object({
    body: object({
        email: string({
            required_error: "Email is a required field",
          }).email("Invalid email addresss."),
        password: string()
        .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
        .regex(new RegExp(".*[a-z].*"), "One lowercase character")
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
          new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
          "One special character"
        )
        .min(8, "Must be at least 8 characters in length"),
    })
})

export type TAuthSigninRequest = TypeOf<typeof login>

export type TAuthSigninRequestBody = TAuthSigninRequest["body"]




// exports
export const authSchema = {
    signup, login, googleSignUp
}
