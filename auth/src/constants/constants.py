
class Constants:

    ## Token Generation
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 15
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    # Username Generation
    MAX_TOTAL_LEN = 8

    # Response Messages
    INVALID_TOKEN = "Invalid or expired token"
    LOGIN_SUCCESSFUL = "Login successful!!"
    LOGOUT_SUCCESSFUL = "Logout successful!!"
    SIGNUP_SUCCESSFUL = "Signup successful!!"
    INVALID_CREDS = "Invalid credentials"
    SESSION_EXPIRED = "Session expired. Please login again!"
    DB_ERROR = "Database error occurred"
    GENERAL_ERROR = "An error occurred!"