export class NotfoundException extends Error{
    protected status: number;
    constructor(message: string){
        super(message);
        this.status = 404;
    }
}