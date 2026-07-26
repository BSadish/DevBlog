export class ApiResponse {
    constructor(statusCode, message = "success", data) {
        this.statusCode = statusCode

        this.data = data
        this.message = message
        this.statusCode = statusCode < 400
    }
}