$(document).ready(()=>{
    var socket = io();
    $('#formulario').submit((e)=>{
       e.preventDefault();
       var data = {
           _id: $('#_id').val(),
           first_name: $('#first_name').val(),
           last_name: $('#last_name').val(),
           timezone: $('#timezone').val(),
           locale: $('#locale').val(),
           profile_pic:$('#profile_pic').val()
       };
       if(data._id===''){
           $('#_id').focus();
           return alert('Debe ingresar un ID');
       }
       if(data.first_name===""){
           $('#first_name').focus();
           return alert("Debe ingresar un nombre!");
       }
       //socket.emit('crear',data);
        var accion = 'crear';
       if($('.warning').length>0) accion = 'actualizar';
       $('.warning').removeClass('warning');
       socket.emit(accion,data);
       $('#formulario').trigger('reset');
       return true;
    });
    socket.on('nueva data',()=>{
        alert("Se ha añadido un registro");
    });
    socket.on('eliminar data',()=>{
        alert("Se ha eliminado un registro");
    });
    socket.on('actualizar data',()=>{
        alert("Se ha actualizado un registro");
    });
    socket.on('nuevo',(data)=>{
        fill(data);
    });
    var fill = (data)=>{
        if($('#'+data._id).length===0) {
            var $row = $('<tr id="' + data._id + '">');
            $row.append('<td>' + data._id + '</td>');
            $row.append('<td>' + data.first_name + '</td>');
            $row.append('<td>' + data.last_name + '</td>');
            $row.append('<td>' + data.timezone + '</td>');
            $row.append('<td>' + data.locale + '</td>');
            $row.append('<td>' + data.profile_pic + '</td>');
            $row.append('<td><button class="btn btn-success btn-sm" name="btnAct">Actualizar</button></td>');
            $row.append('<td><button class="btn btn-danger btn-sm" name="btnEli">Eliminar</button></td>');
            $row.data('data', data);
            //las funciones lambda son para poder usar la variable a traves de otras funciones por otra lado
            //habra un error al momento de crear una variable con el mismo valor de id
            $row.find('[name=btnEli]').click(function () {
                var _id=$(this).closest('tr').attr('id');
                if(confirm('Continuar con la eliminación del registro?')){
                    $(this).closest('tr').effect("shake");
                    setTimeout(function () {
                        socket.emit('eliminar',_id);
                    },1000);
                }
            });
            $row.find('[name=btnAct]').click(function () {
                console.log("se hizo click al boton de actualizar");
                var data = $(this).closest('tr').data('data');
                console.log(data._id);
                $('#_id').val(data._id);
                $('#first_name').val(data.first_name);
                $('#last_name').val(data.last_name);
                $('#timezone').val(data.timezone);
                $('#locale').val(data.locale);
                $('#profile_pic').val(data.profile_pic);
                $('.warning').removeClass('warning');
                $(this).closest('tr').addClass('warning');
                $(this).closest('table').effect("shake",{},1500);
            });
            $('table tbody').append($row);
        }else{
            var $row = $('#'+data._id);
            $row.find('td:eq(1)').html(data.first_name);
            $row.find('td:eq(2)').html(data.last_name);
            $row.find('td:eq(3)').html(data.timezone);
            $row.find('td:eq(4)').html(data.locale);
            $row.find('td:eq(5)').html(data.profile_pic);
        }
    };
    socket.on('listar',(data)=>{
        data= JSON.parse(data);
        for (var i=0,j=data.length;i<j;i++){
            fill(data[i]);
        }
    });
    socket.on('borrado',(data)=>{
        $('#'+data).remove();
    });
});
