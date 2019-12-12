async function main() {


    let jwt = localStorage.getItem("jwt");
    console.log(jwt);

    if (jwt != "out") {
        loggedIn();
        
    } else {
        // logged out page
    }

    loadWeatherInNav();
   

}

async function loadWeatherInNav() {
    let weather = axios({
        method: 'get',
        url: 'http://api.openweathermap.org/data/2.5/weather?id=4460162&appid=511493cb76df7d7454e9eccae28062d5&units=metric',
        });
    weather.then(value => {
        console.log("weather:", value);
        $("#temp").html('temprature: '+ value['data']['main']['temp'] + "°C");
        $("#humidity").html("humidity: " + value['data']['main']['humidity']);
        //$("#weather").html("weather: " + value['data']['weather'][0]['main']);
        console.log(value.data.weather[0].icon);
        $(`#weather`).html(`<img border="0" id="weathericon" alt="" src="http://openweathermap.org/img/wn/${value.data.weather[0].icon}@2x.png" width="50" height="50"> 
        `);
    }); 
}
async function loggedIn() {

    let jwt = localStorage.getItem("jwt");
    let result  = await axios({
        method: 'GET',
        url: 'http://localhost:3000/account/status',
        headers: {
            'Authorization': 'Bearer ' + jwt,
        }
    });  
    
    
    console.log(result);
    axios.get("http://localhost:3000/user/info", {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawProfile(res));
    axios.get("http://localhost:3000/user/contact/", {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawContact(res));
    axios.get("http://localhost:3000/user/contact/", {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawTransfer(res));
    axios.get("http://localhost:3000/user/contact/", {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => drawRequest(res));


}

function drawRequest(res) {
    //$(`#profile`).append(`<button type="button" class="btn btn-primary" id="request"> request money </button>`);
    $(`#profile`).append(`
        <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#exampleModalRequest">
            request
        </button>
        `);

    $(`#profile`).append(`
    <div class="modal fade" id="exampleModalRequest" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Request money</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <form id = 'submitrequest'> 
                    <input id="requestfrom" type = "text" name = "to" class = 'requestto' placeholder="from">
                    <input type = "number" name = "amount" class = 'requesamount' placeholder="amount">
                    <input type = "text" name = "reference" class = 'requestcomment' placeholder="any comment?">
                    <input type = "checkbox" name = "public" class = 'requestpublic'>
                    <label for = "public">Do you want others notice when you recieve?</label>
                  </form>
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="request btn btn-primary">request</button>
        </div>
      </div>
    </div>
  </div>
  `);

    //$('#request').on('click', () => {
        //$('#request').hide()
        /*
        $('#profile').append(`<div id = 'submitrequest'> 
                    <input id="requestfrom" type = "text" name = "to" class = 'requestto' placeholder="from">
                    <input type = "number" name = "amount" class = 'requesamount' placeholder="amount">
                    <input type = "text" name = "reference" class = 'requestcomment' placeholder="any comment?">
                    <input type = "checkbox" name = "public" class = 'requestpublic'>
                    <label for = "public">Do you want others notice when you recieve?</label>
                    <button class = "request" type = "button">send</button>
                  </div>`);
                 */
        $("#requestfrom").on("keyup",_.debounce(async function(e) {
        //res=await axios.get("http://localhost:3000/user/contact/", {headers: { Authorization: `Bearer ${jwt}` }});
        console.log(res.data.result);
        $("#requestfrom").autocomplete({
            source: res.data.result,
        });
        },300));
        $('.request').on('click', () => {
            let to = $('.requestto').val();
            let amount = $('.requesamount').val();
            let comment = $('.requestcomment').val();
            let public = $('.requestpublic').is(":checked")
            if(!res.data.result.includes(to)) alert("friend not found")
            else  if(amount < 1) alert("invalid amount")
            else {
                axios.get('http://localhost:3000/private/increment', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                    let nextId = 1;
                    nextId += res.data.result;
                    axios.get("http://localhost:3000/account/status", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                        let user = "";
                        user += result.data.user.name;
                        axios.post('http://localhost:3000/private/request/' + nextId, {data :{id: nextId, from: user, to: to, amount: amount * 1, comment: comment, accepted: false, public: public}}, {headers: { Authorization: `Bearer ${jwt}` }})
                        axios.post('http://localhost:3000/private/increment', {data: nextId}, {headers: { Authorization: `Bearer ${jwt}` }})
                    }) 
                })
            };
            //$('#submitrequest').remove();
            //$('#request').show()
        })
}

function drawTransfer(res) {
    // send money here
    //$(`#profile`).append(`<button type="button" class="btn btn-dark" id="send"> send </button>`);
    $(`#profile`).append(`
        <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#exampleModalSend">
            send
        </button>
        `);

    let jwt = localStorage.getItem("jwt");
    $(`#profile`).append(`
    <div class="modal fade" id="exampleModalSend" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Send money</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <div id = 'submitsend'> 
        <input id="transferto" type = "text" name = "to" class = 'textto' placeholder="to">
        <input type = "number" name = "amount" class = 'textamount' placeholder="amount">
        <input type = "text" name = "reference" class = 'textcomment' placeholder="any comment?">
        <input type = "checkbox" name = "public" class = 'textpublic'>
        <label for = "public">Do you want others see this transfer?</label>
      </div> 
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="send btn btn-primary">send</button>
        </div>
      </div>
    </div>
  </div>
  `);
    //$('#send').on('click', () => {
        //$('#send').hide()
        /*
        $('#profile').append(`<div id = 'submitsend'> 
                    <input id="transferto" type = "text" name = "to" class = 'textto' placeholder="to">
                    <input type = "number" name = "amount" class = 'textamount' placeholder="amount">
                    <input type = "text" name = "reference" class = 'textcomment' placeholder="any comment?">
                    <input type = "checkbox" name = "public" class = 'textpublic'>
                    <label for = "public">Do you want others see this transfer?</label>
                    <button class = "send" type = "button">send</button>
                  </div>`);
                  */

    
        $("#transferto").on("keyup",_.debounce(async function(e) {
        //res=await axios.get("http://localhost:3000/user/contact/", {headers: { Authorization: `Bearer ${jwt}` }});
        console.log(res.data.result);
        $("#transferto").autocomplete({
            source: res.data.result,
        });
        },300));
        $('.send').on('click', () => {
            let to = $('.textto').val();
            let amount = $('.textamount').val();
            let comment = $('.textcomment').val();
            let public = $('.textpublic').is(":checked")
            if(!res.data.result.includes(to)) alert("friend not found")
            else  if(amount < 1) alert("invalid amount")
            else {
                axios.get("http://localhost:3000/user/amount", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                    let asset = result.data.result
                    if(asset < amount) alert("we need more gold")
                    else {
                        axios.get('http://localhost:3000/private/increment', {headers: { Authorization: `Bearer ${jwt}` }}).then((res) => {
                            let nextId = 1;
                            nextId += res.data.result;
                            axios.get("http://localhost:3000/account/status", {headers: { Authorization: `Bearer ${jwt}` }}).then((result) => {
                                let user = "";
                                user += result.data.user.name;
                                axios.post('http://localhost:3000/private/trans/' + nextId, {data :{id: nextId, from: user, to: to, amount: amount * 1, comment: comment, accepted: false, likes: [], public: public}}, {headers: { Authorization: `Bearer ${jwt}` }})
                                axios.post('http://localhost:3000/private/increment', {data: nextId}, {headers: { Authorization: `Bearer ${jwt}` }})
                                let sum = 0;
                                sum += asset - amount;
                                console.log(sum);
                                axios.post('http://localhost:3000/user/amount', {data: sum}, {headers: { Authorization: `Bearer ${jwt}` }})
                                
                                window.location.reload();
                            }) 
                        })
                    }
                })
            }
            //$('#submitsend').remove();
            //$('#send').show()
        })
    //$(".text").val(data);
}

function renderProfile(person) {
    $(`#profile`).append(`
    <div class="card bg-light special-card" style="max-width:15rem;">
    <div class="card-header">
        My Profile
    </div>
    <div class="card-body" id="profilecol">

    <p> Username: ${person.username} </p>
    <p> First Name: ${person.firstname} </p>
    <p> Last Name: ${person.lastname} </p>
    <p> Onyen: ${person.onyen} </p>
    <p> PID: ${person.pid} </p>

    <input class="btn btn-outline-dark btn-sm" type="button" value="edit" id="editprofilebtn"> 
    </div>
    </div>

    `);

}
    
function drawProfile(res) {
    console.log("res", res);

    let jwt = localStorage.getItem("jwt");
    let person = res.data.result;
    renderProfile(person);

    $(`#editprofilebtn`).on('click', () => {
        $(`#profilecol`).replaceWith(`
            <div class="card-body">
            <form>
                <p> Username </p>
                <input type="text" value="${person.username}">
                <p> First Name </p>
                <input type="text" value="${person.firstname}">
                <p> Last Name </p> 
                <input type="text" value="${person.lastname}">
                <p> Onyen </p>
                <input type="text" value="${person.onyen}">
                <p> PID </p>
                <input type="text" value="${person.pid}">
                <p> Amount </p>
                <input type="text" value="${person.pid}">
            </form>
            <input class="btn btn-info" type="button" value="submit" id="submitprofilebtn"> 
            </div>
        `);
        $(`#submitprofilebtn`).on('click', () => {
            //axios
            let update = 
                { 
                username: $(`form input:nth-child(2)`).val(),
                firstname: $(`form input:nth-child(4)`).val(),
                lastname: $(`form input:nth-child(6)`).val(), 
                onyen: $(`form input:nth-child(8)`).val(),
                pid: $(`form input:nth-child(10)`).val(),
                };
            console.log(update);
            axios.post("http://localhost:3000/user/info/", {data: update },{headers: { Authorization: `Bearer ${jwt}` }});
            window.location.reload();

        });
    });


}


function drawContact(res) {
    let jwt = localStorage.getItem("jwt");

    console.log("in contact", res);
    $(`#contact`).append(`
        <div class="card bg-light special-card">
        <div class="card-header" id="contactcardheader">
            Contact
        </div>
        <div class="card-body" id="contactcard">
        </div>
        </div>
    `);

    $(`#contactcardheader`).append(`
    <button type="button" class="btn btn-outline-dark btn-sm float-right" data-toggle="modal" data-target="#exampleModal">
                            add
    </button>
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Contact</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <input class="modal-body" id="contactname">
                
            </input>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="addcontactbtn">Save changes</button>
            </div>
            </div>
        </div>
        </div>
                        
                        
                        
                        
                        `);
    
    
    $(`#addcontactbtn`).on('click', () => {
        let contact = $(`#contactname`).val();
        axios.post("http://localhost:3000/user/contact/" + contact, {data: {} },{headers: { Authorization: `Bearer ${jwt}` }});
        window.location.reload();
    });

    for (let i = 0; i < res.data.result.length; i++) {
        $(`#contactcard`).append(`<p> ${res.data.result[i]} </p>`);
    }


}






$(document).ready(main());