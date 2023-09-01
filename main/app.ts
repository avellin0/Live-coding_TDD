import express from "express"
import { routes } from "./routes/routes"



class AppControler {
    public app = express()

    constructor() {
        this.App()
        this.Middleware()
        this.Routes()
    }


    App() {
        return this.app
    }

    Middleware(): void {
        this.app.use(express.json())
    }

    Routes(): void {
        this.app.use(routes)
    }

}

export =  new AppControler().App()
