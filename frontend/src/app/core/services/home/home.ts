export interface SearchBoxResultInterface {
    _id: number;
    name: string;
    type: string;
}


export interface Home {
    data: Array<User>;
    ad: any;
}

export interface User {
    id: number;
    email: string;
}
