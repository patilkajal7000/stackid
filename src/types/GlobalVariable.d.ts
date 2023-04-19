declare global {
    namespace NodeJS {
        interface Global {
            gapi: any;
        }
    }
}
export default global;
