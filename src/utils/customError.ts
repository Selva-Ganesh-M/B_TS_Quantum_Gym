export class customError extends Error {
    public status: string
    public errstatuscode: number
    public message: any
    constructor(errstatuscode: number, message: any) {
      super(message)
      this.errstatuscode = errstatuscode
      this.message = message
      this.status = "failure"
    }
  }

