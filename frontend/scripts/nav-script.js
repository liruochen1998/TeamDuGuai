function loadNav() {
    let jwt = localStorage.getItem("jwt");
    if (jwt == "out") {
    $('body').prepend(`
    <nav id="nav" class="navbar navbar-expand-lg navbar-light bg-unc fixed-top">
      <a class="navbar-brand" href="#">CarolinaPay</a>
      <a id="weather"> Weather </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Useful Links
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="https://sakai.unc.edu">Sakai</a>
                <a class="dropdown-item" href="https://connectcarolina.unc.edu">Connect Carolina</a>
                <a class="dropdown-item" href="https://dining.unc.edu/menu-hours/">CDS</a>
                <a class="dropdown-item" href="https://move.unc.edu/parking/">Parking</a>
                <a class="dropdown-item" href="https://library.unc.edu/">Library</a>
                <a class="dropdown-item" href="https://campusrec.unc.edu/">Rec</a>
              </div>
              </a>
            </li>
          </ul>
        </div>
      
      <a href="login/create.html"> <i class="fas fa-user-plus" fa-10x></i>Sign up</a> 
      <a href="login/index.html"> <i class="fas fa-sign-in-alt"></i> Login </a>
    </nav>
    `);
    } else {
      $('body').prepend(`
      <nav id="nav" class="navbar navbar-expand-lg navbar-light bg-unc fixed-top">
        <a class="navbar-brand" href="#">CarolinaPay</a>
        <a id="weather"> Weather </a>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Useful Links
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="https://sakai.unc.edu">Sakai</a>
                <a class="dropdown-item" href="https://connectcarolina.unc.edu">Connect Carolina</a>
                <a class="dropdown-item" href="https://dining.unc.edu/menu-hours/">CDS</a>
                <a class="dropdown-item" href="https://move.unc.edu/parking/">Parking</a>
                <a class="dropdown-item" href="https://library.unc.edu/">Library</a>
                <a class="dropdown-item" href="https://campusrec.unc.edu/">Rec</a>
              </div>
              </a>
            </li>
          </ul>
        </div>
        
        <span id="logoutbtn"> 

        <span> <i class="fas fa-sign-out-alt" id="logoutbtn" type=submit"></i> log out </span>

        </span>
      </nav>
      `);
      $(`#logoutbtn`).on('click', () => {
        localStorage.setItem("jwt", "out");
        window.location.reload();
      });
    }


    console.log("nav ready");
    $('body').prepend(`<div style="height: 100px;"></div>`);


    $('body').append(` 
    <div class="alert alert-primary alert-dismissible fade show" role="alert">
    Hello! Hope you enjoy CarolinaPay so far!
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
      <div class="row">
        <div class="col" id="profile"> </div>
        <div class="col-6" id="feed"> 
          <div id="public" class="card bg-light special-card">
                <div class="card-header">
                    Today's Dinning
                </div>
                <div class="card-body" id="dinninginfo"> </div>
                <button type="button" class="btn btn-outline-success" id="comment">how do you think about today's dinning</button>
                <div class="card-header">
                    Today's parking
                </div>
                <div class="card-body" id="parkinginfo"> </div>
          </div>
          <div id = private></div>
        </div>
        <div class="col" id="contact"> </div>
      </div>


    </div>

    <footer class="footer mt-auto py-3">
      <div class="container">
        <span class="text-muted">CarolinaPay @ Fall 2019 COMP 426 Final Project by Team DuGuai</span>
      </div>
    </footer>


    `);

  }

$(document).ready(loadNav());