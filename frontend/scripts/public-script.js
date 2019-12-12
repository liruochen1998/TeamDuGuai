$(document).ready(function () {
    async function newsFeeds (){   
       
        //axios.delete('http://localhost:3000/public/dinning').then((res) => console.log(res));
        //axios.post('http://localhost:3000/public/dinning/rams', {data :{name: "rams", menu: ["Squid", "Octopus", "Scallops", "Lobster", "Crab"]}}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/public/dinning/lenoir', {data :{name: "lenoir", menu: ["Filet", "Oysters", "Mussels", "Clams", "Tuna"]}}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/public/dinning/shanghai', {data :{name: "shanghai dumplings", menu: ["dumpling"]}}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/public/parking/morison', {data :{name: "morison deck", price: "$2"}}).then((res) => console.log(res));
        //axios.post('http://localhost:3000/public/comment', {data : {}}).then((res) => console.log(res));
        //axios.get('http://localhost:3000/public/dinning').then((res) => drawMenu(res));
        axios.get('http://localhost:3000/public/dinning').then((res) => drawMenu(res));
        axios.get('http://localhost:3000/public/parking').then((res) => drawPark(res));
        
    };
    function drawMenu(res) {
        $('.col-6').append(
            `<div id="public" class="card bg-light special-card">
                <div class="card-header">
                    Today's Dinning
                </div>
                <div class="card-body" id="dinninginfo"> </div>
                <button type="button" class="btn btn-outline-success" id="comment">how do you think about today's dinning</button>
            </div>`
        );
        //console.log(Object.keys(res.data.result));
        let dinnings = Object.keys(res.data.result);
     
        for(let i = 0; i < dinnings.length; i++) {
            let dinning = res.data.result[dinnings[i]];
            $('#dinninginfo').append(
        `<div class="toast" data-autohide="false">
            <div class="toast-header">
                    <strong class="mr-auto">${dinning.name}</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <div class="toast-body">
                <div> ${dinning.menu} </div>
            </div>
        </div>
        `
        );
            $(`.toast`).toast('show');
        }

        $('#comment').on('click', () => {
            let jwt = localStorage.getItem("jwt");
            if (jwt == "out") alert("plaese login to leave comment!")
            else{
                $('#comment').hide()
                $('#dinninginfo').append(`<div id = 'submitpost'> 
                            <input id="textcommentinput" type = "text" name = "reference" class="textcomment" placeholder="any comment?">
                            <button id="tete" class = "post btn btn-sm btn-outline-dark" type = "button">post</button>
                        </div>`);
                $('#tete').on('click', () => {
                    console.log($(`#textcommentinput`));
                    let comment = $('#textcommentinput').val();
                    console.log(comment);
                    axios.get('http://localhost:3000/public/increment', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                        let nextId = 1;
                        nextId += res.data.result;
                        axios.get("http://localhost:3000/account/status", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                            let user = "";
                            user += result.data.user.name;
                            axios.post('http://localhost:3000/public/comment/' + nextId, {data :{id: nextId, from: user, comment: comment, likes: []}}, {headers: { Authorization: `Bearer ${jwt}` }})
                            axios.post('http://localhost:3000/public/increment', {data: nextId}, {headers: { Authorization: `Bearer ${jwt}` }})
                        })
                    })
                    $("#submitpost").remove()
                })
            }
        })
        axios.get('http://localhost:3000/public/comment').then((res) => drawComment(res));
    }

    function drawComment(res) {
        console.log("comment", res)
        let com = Object.keys(res.data.result);
        $('#dinninginfo').append(
            `<div id = dinningcomment></div>`
        )
        for(let i = 0; i < com.length; i++) {
            let rec = res.data.result[com[i]];
            let likeid = "commentlike" + rec.id;
            let lkid = "commentlk" + rec.id;
            let id = "rec" + rec.id
            let delid = "del" + rec.id
            $('#dinningcomment').append(
                `<div id = ${id} class = "record">
                    <div>${rec.from}</div>
                    <div>${rec.comment}</div>
                    <div id = ${lkid}>likes: ${rec.likes.length}</div>
                </div>`
            );
            let jwt = localStorage.getItem("jwt");
            if (jwt != "out"){
                axios.get("http://localhost:3000/account/status", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                    let user = "";
                    user += result.data.user.name;
                    if(!rec.likes.includes(user)){
                        $('#' +  id).append(`<button id = ${likeid} class="btn btn-sm btn-outline-danger">like</button>`)
                    }
                    else{
                        $('#' +  id).append(`<button id = ${likeid} class="btn btn-sm btn-outline-danger">unlike</button>`)
                    }
                    $('#' + likeid).on('click', () => {
                        if($('#' + likeid).html() == 'like') {
                            axios.get('http://localhost:3000/public/comment/' + rec.id + '/likes', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                                let likepeople = res.data.result;
                                likepeople.push(user)
                                axios.post('http://localhost:3000/public/comment/' + rec.id + '/likes', {data: likepeople}, {headers: { Authorization: `Bearer ${jwt}` }})
                                $('#' + lkid).html("likes: " + likepeople.length)
                            })
                            $('#' + likeid).html("unlike")
                        }
                        else {
                            axios.get('http://localhost:3000/public/comment/' + rec.id + '/likes', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                                let likepeople = res.data.result;
                                let reduced = []
                                for(let i = 0; i < likepeople.length; i++) {
                                    if(likepeople[i] != user) reduced.push(likepeople[i])
                                }
                                axios.post('http://localhost:3000/public/comment/' + rec.id + '/likes', {data: reduced}, {headers: { Authorization: `Bearer ${jwt}` }})
                                $('#' + lkid).html("likes: " + reduced.length)
                            })
                            $('#' + likeid).html("like")
                        }
                    })
                    if(rec.from == user) {
                        $('#' +  id).append(`<button id = ${delid} class="btn btn-sm btn-outline-dark">delete</button>`)
                        $('#' + delid).on('click', () => {
                            axios.delete('http://localhost:3000/public/comment/' + rec.id, {headers: { Authorization: `Bearer ${jwt}` }})
                        })
                    }
                })
            }
        }
    }

    function drawPark(res) {
        $('.col-6').append(
            `<div id="public" class="card bg-light special-card">
                <div class="card-header">
                    Today's parking
                </div>
                <div class="card-body" id="parkinginfo"> </div>
            </div>`
        );
        let parks = Object.keys(res.data.result);
        for(let i = 0; i < parks.length; i++) {
            let park = res.data.result[parks[i]];
            $('#parkinginfo').append(
            `<div class="toast" data-autohide="false">
            <div class="toast-header">
                    <strong class="mr-auto">${park.name}</strong>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
            </div>
            <div class="toast-body">
                <div> ${park.name}: ${park.price} </div>
            </div>
        </div>
        `
            );
            $(`.toast`).toast('show');
        }
    }
    newsFeeds();

});