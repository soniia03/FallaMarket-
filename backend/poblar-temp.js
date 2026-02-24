const mongoose = require('mongoose');
const URI = 'mongodb+srv://FallerosMarket:SoniaYHugo@cluster0.ezgcchu.mongodb.net/Fallerosmarkey?retryWrites=true&w=majority&appName=Cluster0';

const trajesSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    material: { type: String, required: true },
    propietario: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    disponible: { type: Boolean, required: true },
}, { versionKey: false, timestamps: true });

const Traje = mongoose.model('Trajes', trajesSchema, 'trajes2026');

const materiales = ['Seda', 'Brocado', 'Terciopelo', 'Raso', 'Tafetán', 'Damasco', 'Algodón', 'Lino', 'Paño fino', 'Seda salvaje'];
const colores = ['Rojo', 'Azul', 'Verde', 'Morado', 'Dorado', 'Plateado', 'Negro', 'Blanco', 'Rosa', 'Coral', 'Turquesa', 'Marfil', 'Granate', 'Burdeos'];
const propietarios = ['Hugo', 'Sonia', 'Carlos', 'María', 'Javier', 'Laura', 'Antonio', 'Carmen', 'Miguel', 'Isabel', 'Pablo', 'Rosa', 'Francisco', 'Ana', 'Luis', 'Pilar', 'José', 'Amparo', 'Roberto', 'Victoria'];
const tipos = ['Fallero Clásico', 'Fallera Mayor', 'Fallero Premium', 'Fallera Tradicional', 'Fallero Elegante', 'Fallera Infantil', 'Fallero Vintage', 'Fallera Imperial'];

const trajesData = [];
for (let i = 1; i <= 50; i++) {
    const material = materiales[Math.floor(Math.random() * materiales.length)];
    const color = colores[Math.floor(Math.random() * colores.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const propietario = propietarios[Math.floor(Math.random() * propietarios.length)];
    const precio = Math.floor(Math.random() * 1200) + 300;
    const disponible = Math.random() > 0.2;
    
    trajesData.push({
        nombre: `Traje ${tipo} ${color} #${i}`,
        material: material,
        propietario: propietario,
        descripcion: `Hermoso traje ${tipo.toLowerCase()} en color ${color.toLowerCase()} confeccionado con ${material.toLowerCase()}. Perfecto para las festividades falleras de Valencia con acabados artesanales de alta calidad.`,
        precio: precio,
        disponible: disponible
    });
}

async function poblarDB() {
    try {
        await mongoose.connect(URI);
        console.log(' Conectado a MongoDB');
        await Traje.deleteMany({});
        console.log('  Colección limpiada');
        const resultado = await Traje.insertMany(trajesData);
        console.log(` ${resultado.length} trajes insertados correctamente`);
        await mongoose.connection.close();
        console.log(' Conexión cerrada');
    } catch (error) {
        console.error(' Error:', error);
        process.exit(1);
    }
}
poblarDB();
