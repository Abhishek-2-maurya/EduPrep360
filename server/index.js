import {app} from "./src/app.js"
import DBConnect from "./src/config/db.js"

DBConnect()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app listen on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.error(err);
})
