const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/guardar-datos', (req, res) => {
    const datos = req.body;

    // Guarda los datos en un archivo JSON.
    fs.writeFile('datosFormulario.json', JSON.stringify(datos, null, 2), (err) => {
        if (err) {
            console.error('Error al guardar los datos:', err);
            res.status(500).send('Error al guardar los datos');
        } else {
            res.send('Datos guardados exitosamente');
        }
    });
});

app.listen(5500, () => {
    console.log('Servidor escuchando en http://localhost:5500');
});
