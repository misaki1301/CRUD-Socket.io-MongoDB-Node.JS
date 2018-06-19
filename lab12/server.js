let express = require('express');
let app = express();
let http = require('http').Server(app);
let port = process.env.PORT || 3000;
let io = require('socket.io')(http);
let user = require('./models/user');

app.set('view engine','jade');
app.use('/static', express.static('public'));
app.get('/',(req,res)=>{
   res.render('main');
});

http.listen(port,()=>{
   console.log("Servidor conectado en *:"+port);
});
//la declaración del socket.io va despues de crear el servidor y el listen de http
io.on('connection',(socket)=>{
    console.log("Usuario conectado!");
    socket.on("disconnect",()=>{
        console.log("usuario desconectado");
    });
    socket.on('crear',(data)=>{
        console.log(data);
        user.create(data,(res)=>{
            io.emit('nuevo',res);
        });
        socket.broadcast.emit('nueva data');
    });
    socket.on('actualizar',(data)=>{
        user.update(data,(res)=>{
            io.emit('nuevo',res);
        });
        socket.broadcast.emit('actualizar data');
    });
    socket.on('eliminar',(data)=>{
        user.delete(data,(res)=>{
            io.emit('borrado',res);
        });
        socket.broadcast.emit('eliminar data');
    });
    user.show((data)=>{
        socket.emit('listar',data);
    });

});