$(document).ready(function () {
    // at the same time, pass it to user
    $('.main').on('click', '#create', async function(){      
        let username = $('#username').val();
        let passWord = $('#password').val();
      
        let account = await axios({
            method: 'POST',
            url: 'http://localhost:3000/account/create',
            data: {
                    "name": username,
                    "pass": passWord,
            }
        });  
        window.location.replace("../login/index.html");
    });
});