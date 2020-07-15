/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
export interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: string): Promise<string>;
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export abstract class AbstractHandler implements Handler {
    private nextHandler: Handler;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        // Returning a handler from here will let us link handlers in a convenient way
        return handler;
    }

    public async handle(request: string): Promise<string> {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return null;
    }
}
