import { app } from './app'
import { runDB } from './db/mongoDb'
import { SETTINGS } from './settings'

const startApp = async () => {
    const res = await runDB(SETTINGS.MONGO_URL, true)
    if (!res){process.exit()}
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

startApp()