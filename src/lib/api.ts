import type {CreateUserRequest, CreateUserResponse, GetOccupationsAndStatesResponse} from "./type";

export const CREATE_USER_ENDPOINT = {
    url: "https://frontend-take-home.fetchrewards.com/form",
    async get(): Promise<GetOccupationsAndStatesResponse> {
        return await fetch(this.url).then((res) => res.json());
    },
    async post(data: CreateUserRequest): Promise<CreateUserResponse> {
        return await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((res) => res.json());
    }
}