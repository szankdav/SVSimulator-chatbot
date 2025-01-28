export type SqlParams = (string | number)[];

export const paramaterValidator = (params: SqlParams) => {
    for (const param of params) {
        if(typeof param === "string" && param.length === 0){
           throw new Error("String parameter can't be empty!");
        }
    }
}