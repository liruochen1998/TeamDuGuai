
// handle first time signing in

$(document).ready(function () {
    let jwt = localStorage.getItem("jwt");
    $('.main').on('click', '#firsttimedone', async function(){      
        console.log("fisrt time done clicked");
        let username = $('#usernamef').val();
        let first = $('#firstnamef').val();
        let last = $('#lastnamef').val();
        let onyen = $('#onyenf').val();
        let pid = $('#pidf').val();
        let userInfo = {
            username: username,
            firstname: first,
            lastname: last,
            onyen: onyen,
            pid: pid,
            
        };
        let userContact = {};
        let user = {
            info: userInfo,
            contact: userContact
        }
        axios.post("http://localhost:3000/user/info", {data: userInfo},{headers: { Authorization: `Bearer ${jwt}` }});
        axios.post("http://localhost:3000/user/contact", {data: userContact},{headers: { Authorization: `Bearer ${jwt}` }});
        axios.post("http://localhost:3000/user/amount", {data: 1000},{headers: { Authorization: `Bearer ${jwt}` }});
        // axios.post('http://localhost:3000/private/trans/1', {data: {
        //     id: 1,
        //     from: "kevin",
        //     to: "larry",
        //     amount: 10000,
        //     comment: "duguai",
        //     accepted: true,
        //     likes: [
        //       "larry",
        //       "test",
        //       "kevin"
        //     ]
        //   },}, {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/private/increment', {data: 1}, {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => console.log(res));
        window.location.replace("../index.html");
    });
});
    