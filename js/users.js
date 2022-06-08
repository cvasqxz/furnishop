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


function createNavbarItem(title, linkId) {
    let list = document.createElement("li");
    list.className = "nav-item";
    list.id = linkId;

    let link = document.createElement("a");
    link.className = "nav-link font-monospace active";

    link.href = "#";
    link.textContent = title;

    list.appendChild(link);
    return list;
}

function createBalanceTitle(title) {
    let balanceTitle = document.createElement("p");
    balanceTitle.className = "font-monospace text-decoration-underline fs-6";
    balanceTitle.textContent = title;
    return balanceTitle;
}


async function getAccountBalance() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    web3 = new Web3(window.ethereum);
    activeAccount = await web3.eth.getAccounts();
    
    let address = activeAccount[0];

    let req = await fetch("https://api.x.immutable.com/v2/balances/" + address);
    let balanceJSON = await req.json();

    document.getElementById("connection-btn").remove();

    let userSubstr = address.substring(0, 6) + ".." + address.substring(address.length - 4);
    let userText = createNavbarItem(userSubstr, "show-balance");

    let balance = document.getElementById("balance-collapse");
    userText.addEventListener("click", function () {
        new bootstrap.Collapse(balance);
    });

    navbar.appendChild(userText);

    let balanceObj = document.getElementById("balance-info");

    let ethTitle = createBalanceTitle("ethereum");
    balanceObj.appendChild(ethTitle);

    let ethBalance = await web3.eth.getBalance(address);

    let newBalance = document.createElement("p");
    newBalance.className = "m-0 font-monospace";
    newBalance.innerHTML = "<b>&nbsp;ETH</b>: " + Number((ethBalance / 1e18).toFixed(6));
    balanceObj.appendChild(newBalance);

    let balanceDivisor = document.createElement("br");
    balanceObj.appendChild(balanceDivisor);

    let imxTitle = createBalanceTitle("immutable-x");
    balanceObj.appendChild(imxTitle);

    if (balanceJSON.result.length > 0) {
        balanceJSON.result.forEach(function (b) {
            let newBalance = document.createElement("p");
            newBalance.className = "m-0 font-monospace";

            switch (b.symbol) {
                case "ETH":
                    newBalance.innerHTML = "<b>&nbsp;" + b.symbol + "</b>: " + Number((b.balance / 1e18).toFixed(6));
                    break;

                case "USDC":
                    newBalance.innerHTML = "<b>" + b.symbol + "</b>: " + Number((b.balance / 1e6).toFixed(6));
                    break;
            }

            balanceObj.appendChild(newBalance);
        });
    }
}