export type Occupation = string;

export type State = {
    name: string
    abbreviation: string
};

export type UserInfo = {
    name: string,
    email: string,
    password: string,
    occupation: string,
    state: string
}

export type SelectOption = {
    name: string
    value: string
}

export type GetOccupationsAndStatesResponse = {
    occupations: Array<Occupation>,
    states: Array<State>
}

export type CreateUserRequest = UserInfo;

export type CreateUserResponse = UserInfo;