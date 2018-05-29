//CONECCION DE SOCKET DEL LCIENTE

$(function () {

    const socket = io();
    // OBTENIENDO LOS ELEMENTOS DEL DOM DESDE LA INTERFAZ. // El dlolar es para diferenciar que estoy guardadnod un elkemento del dom
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    const $users = $('#usernames')
    // -- OBTENER LOS DATOS DEL NICKNAME FORM
    const $nickForm = $('#nickForm')
    const $nickName = $('#nickname')
    const $nickError = $('#nickError')

   
    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickName.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                    <div class="alert alert-danger">
                        That username already exist.
                    </div>
                `)
            }
            $nickName.val('');
        })
    })

    // EVENTOS
    $messageForm.submit( e => {
        e.preventDefault(); // cancelar el comportamiento por defecto de refrescar la pagina
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
      });

    socket.on('new message', (data, user) => {
        $chat.append(`<b> ${data.nick} </b>` + data.msg + '<br/>');
    })

    socket.on('usernames', data => {
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<i class="fas fa-user-secret"></i> <button type="button" class="btn btn-secondary">${data[i]}</button> <br/>`
        }
        $users.html(html);
    })

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    })

    socket.on('load old msgs', msgs => {
        for (let i = 0; i < msgs.length; i++) {
            displayMSG(msgs[i])
        }
    })

    function displayMSG(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    }

})