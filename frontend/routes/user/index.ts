import api from "../api"

export const fetchUserData = async () => {
    console.log("Login form submit!")
    try {
        const response = await api.get("v1/users/profile/anild")
        const userData =  {
            firstName: response.data?.first_name,
            lastName: response.data?.lasst_name,
            userName: response.data?.username,
            email: response.data?.email_id
        };

        return userData;
    } catch(error) {
        console.error("err", error)
    }
}