const usuarioMongoDB = process.env.USUARIOMONGODB
const senhaMongoDB = process.env.SENHAMONGODB
module.exports={
    URIMongo:`mongodb+srv://${usuarioMongoDB}:${senhaMongoDB}@cluster0.jhnt0.mongodb.net/ammo`
}