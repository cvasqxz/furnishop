var navbar = document.getElementById("navbar-links");

var web3;
var activeAccount;

if (window.ethereum) {
    let linkItem = createNavbarItem("Connect wallet", "connection-btn");

    linkItem.addEventListener("click", function() {
      getAccountBalance();
    });

    navbar.appendChild(linkItem);
}


function createNavbarItem(title, linkId, mono=false) {
    let list = document.createElement("li");
    list.className = "nav-item";
    list.id = linkId;

    let link = document.createElement("a");

    if (mono) {
        link.className = "nav-link font-monospace";
    } else {
        link.className = "nav-link";
    }

    link.href = "#";
    link.textContent = title;

    list.appendChild(link);
    return list;
}



async function getAccountBalance() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    web3 = new Web3(window.ethereum);
    activeAccount = await web3.eth.getAccounts();
    
    let address = activeAccount[0];

    let req = await fetch("https://api.x.immutable.com/v2/balances/" + address);
    let balanceJSON = await req.json();

    if (balanceJSON.result.length > 0) {
        document.getElementById("connection-btn").remove();

        let userSubstr = address.substring(0, 6) + ".." + address.substring(address.length - 4);
        let user = createNavbarItem(userSubstr, "show-balance", true);

        let balance = document.getElementById("balance-collapse");
        let balanceObj = document.getElementById("balance-info");

        balanceJSON.result.forEach(function (b) {
            let newBalance = document.createElement("p");
            newBalance.className = "m-0 font-monospace";

            switch (b.symbol) {
                case "ETH":
                    newBalance.innerHTML = "<b>" + b.symbol + "</b>: " + Number((b.balance / 1e18).toFixed(6));
                    break;

                case "USDC":
                    newBalance.innerHTML = "<b>" + b.symbol + "</b>: " + Number((b.balance / 1e6).toFixed(6));
                    break;
            }

            balanceObj.appendChild(newBalance);
        });

        user.addEventListener("click", function () {
            new bootstrap.Collapse(balance);
        });

        navbar.appendChild(user);
    }
    
}