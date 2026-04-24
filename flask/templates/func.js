
function Get(){
    fetch('/items')
    .then(res => res.json())
    .then(data => {

        let rows = "";

        data.forEach(item => {
            rows += `
                <tr>
                    <td>${item.ItemID}</td>
                    <td>${item.Code}</td>
                    <td>${item.Category}</td>
                    <td>${item.Type}</td>
                    <td>${item.Status}</td>
                    <td><button onclick="modifyItem('${item.Code}')">Modify</button></td>
                </tr>
            `;
        });

        document.getElementById("tableBody").innerHTML = rows;
    });
}

function qrscan(){
    fetch('/qrscan')
    .then(res => res.json())
    .then(data => {
        
     let rows = "";

        data.items.forEach(item => {
            rows += `
                <tr>
                    <td>${item.ItemID}</td>
                    <td>${item.Code}</td>
                    <td>${item.Category}</td>
                    <td>${item.Type}</td>
                    <td>${item.Status}</td>
                    <td><button onclick="handleAction('${item.Code}', '${item.Status}')">
            ${item.Status === "Available" ? "Borrow" : "Return"}</td>
                        

                </tr>
            `;
        });

        document.getElementById("tableBody").innerHTML = rows;
        if(data.missing && data.missing.length > 0){
        alert("item: " + data.missing.join(", ") + " Are not on Database");
    }
        
    });

    
}

function showInput(){
    document.getElementById("inputbox").style.display = "block";
}


function qrmaker(){


    let qrdata = document.getElementById('category').value;
    let category = document.getElementById('type').value;
    qrdata = qrdata.trim();
    category = category.trim();
    if (!qrdata || !category) {
        alert("Please fill in Category and Type.");
        return;
    }
    fetch('/qrmaker' ,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: qrdata, type: category })
    })
    .then(res => res.text())
    .then(data => {
        document.getElementById('data').innerHTML = data;
    });
}

