$(document).ready(function () {
    async function newsFeeds() {   
        jwt = localStorage.getItem("jwt");
        $('.col-6').append(
            `<div id = private></div>`
        )
        //axios.delete('http://localhost:3000/private/trans/2', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/private/increment',{data: 6}, {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => console.log(res));
        let result  = await axios({
            method: 'GET',
            url: 'http://localhost:3000/account/status',
            headers: {
                'Authorization': 'Bearer ' + jwt,
            }
        });  
        user = result.data.user.name;

        axios.get('http://localhost:3000/private/trans', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawTrans(res));
        axios.get('http://localhost:3000/private/request', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawRequest(res));
    };

    function drawRequest(res) {
        let request = Object.keys(res.data.result);
        $('#private').append(
            `<div id = requestaccept></div>`
        )
        for(let i = 0; i < request.length; i++) {
            let rec = res.data.result[request[i]];
            let acceptid = "accept" + rec.id
            console.log("requested")
            if(rec.to == user && !rec.accepted){
                $('#requestaccept').append(
                    `<div id = ${rec.id} class = "record">
                        <div>request from ${rec.from}</div>
                        <div>${rec.comment}</div>
                        <div>${rec.amount}</div>
                        <button id = ${acceptid}>accept</button>
                    </div>`
                )
                $('#' + acceptid).on('click', () => {
                    axios.get('http://localhost:3000/user/amount', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                        let asset = res.data.result
                        if(asset < rec.amount) alert("we need more gold!")
                        else {
                            axios.get('http://localhost:3000/private/increment', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                                let nextId = 1;
                                nextId += res.data.result;
                                axios.get("http://localhost:3000/account/status", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                                    let user = "";
                                    user += result.data.user.name;
                                    let comment = "re: " + rec.comment
                                    axios.post('http://localhost:3000/private/trans/' + nextId, {data :{id: nextId, from: user, to: rec.from, amount: rec.amount * 1, comment: comment, accepted: false, likes: [], public: rec.public}}, {headers: { Authorization: `Bearer ${jwt}` }})
                                    axios.post('http://localhost:3000/private/increment', {data: nextId}, {headers: { Authorization: `Bearer ${jwt}` }})
                                    let sum = 0;
                                    sum += asset - rec.amount;
                                    console.log(sum);
                                    axios.post('http://localhost:3000/user/amount', {data: sum}, {headers: { Authorization: `Bearer ${jwt}` }})
                                    axios.post('http://localhost:3000/private/request/' + rec.id +'/accepted', {data: true}, {headers: { Authorization: `Bearer ${jwt}` }})
                                }) 
                            })
                        }
                        $('#' + acceptid).remove()
                    })
                })
            }
        }
    }

    function drawTrans(res) {
        let trans = Object.keys(res.data.result);
        $('#private').append(
            `<div id = trans></div>`
        )
        for(let i = 0; i < trans.length; i++) {
            let rec = res.data.result[trans[i]];
            let likeid = "like" + rec.id;
            let lkid = "lk" + rec.id;
            if(rec.public || user == rec.from || user == rec.to) {
                $('#trans').append(
                    `<div id = ${rec.id} class = "record">
                        <div>${rec.from} to ${rec.to}</div>
                        <div>${rec.comment}</div>
                        <div id = ${lkid}>likes: ${rec.likes.length}</div>
                    </div>`
                )
                if(!rec.likes.includes(user)){
                    $('#' +  rec.id).append(`<button id = ${likeid}>like</button>`)
                }
                else{
                    $('#' +  rec.id).append(`<button id = ${likeid}>unlike</button>`)
                }
                if(user == rec.from || user == rec.to) {
                    let acceptid = "accept" + rec.id
                    if(rec.accepted || user == rec.from) {
                        $('#trans').append(
                            `<div>
                                ${rec.amount}
                            </div>`
                        )
                    }
                    else {
                        $('#trans').append(
                            `<div>
                                ${rec.amount}
                                <button id = ${acceptid} type = "button">accept</button>
                            </div>`
                        )
                    }
                    
                    $('#' + acceptid).on('click', () => {
                        axios.get('http://localhost:3000/user/amount', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                            let sum = 0;
                            sum += res.data.result + rec.amount;
                            console.log(sum);
                            axios.post('http://localhost:3000/user/amount', {data: sum}, {headers: { Authorization: `Bearer ${jwt}` }})
                            axios.post('http://localhost:3000/private/trans/' + rec.id + '/accepted', {data: true}, {headers: { Authorization: `Bearer ${jwt}` }})
                            $('#' + acceptid).remove()
                        })
                    })
                    $('#' + likeid).on('click', () => {
                        if($('#' + likeid).html() == 'like') {
                            axios.get('http://localhost:3000/private/trans/' + rec.id + '/likes', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                                let likepeople = res.data.result;
                                likepeople.push(user)
                                axios.post('http://localhost:3000/private/trans/' + rec.id + '/likes', {data: likepeople}, {headers: { Authorization: `Bearer ${jwt}` }})
                                $('#' + lkid).html("likes: " + likepeople.length)
                            })
                            $('#' + likeid).html("unlike")
                        }
                        else {
                            axios.get('http://localhost:3000/private/trans/' + rec.id + '/likes', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                                let likepeople = res.data.result;
                                let reduced = []
                                for(let i = 0; i < likepeople.length; i++) {
                                    if(likepeople[i] != user) reduced.push(likepeople[i])
                                }
                                axios.post('http://localhost:3000/private/trans/' + rec.id + '/likes', {data: reduced}, {headers: { Authorization: `Bearer ${jwt}` }})
                                $('#' + lkid).html("likes: " + reduced.length)
                            })
                            $('#' + likeid).html("like")
                        }
                    })
                }
            }
        }
    }
    newsFeeds()
})

