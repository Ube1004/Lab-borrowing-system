
console.log("Hello wortld");


let selectedItemID = null;

 

/* GET ITEMS */
function Get(){
    fetch('/items')
    .then(res => res.json())
    .then(data => {

        let rows = "";

        data.forEach(item => {
            rows += `
                <tr>
                    <td style="width: 30px;">${item.ItemID}</td>
                    <td style="width: 50px;">${item.Code}</td>
                    <td style="width: 50px;">${item.Category}</td>
                    <td style="width: 50px;">${item.Type}</td>
                    <td style="width: 50px;">${item.Status}</td>
                    <td style="width: 50px;"><button onclick="handleModify('${item.ItemID}', '${item.Category}', '${item.Status}', '${item.Type}')">Modify</button></td>
                </tr>
            `;
        });

        document.getElementById("tableBody").innerHTML = rows;
    });
}

/*QR SCAN*/
function qrscan(){
    fetch('/qrscan')
    .then(res => res.json())
    .then(data => {
        
     let rows = "";

        data.items.forEach(item => {
            rows += `
                <tr>
                    <td style="width: 50px;">${item.ItemID}</td>
                    <td style="width: 50px;">${item.Code}</td>
                    <td style="width: 50px;">${item.Category}</td>
                    <td style="width: 50px;">${item.Type}</td>
                    <td style="width: 50px;">${item.Status}</td>
                    <td style="width: 50px;"><button onclick="handleAction('${item.Code}', '${item.Status}')">
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

/*SHOW ADD ITEM*/
function showInput(){
    document.getElementById("inputbox").style.display = "block";
}

/*AUTO ADD ANSWER ON MODIFY*/
function handleModify(id, category, status, type){

    selectedItemID = id;

    document.getElementById("modifyBox").style.display = "block";
    document.getElementById("modifyCategory").value = category;
    document.getElementById("modifyType").value = type;
    
}


/*QR MAKER*/
function qrmaker(){


    let qrdata = document.getElementById('category').value;
    let category = document.getElementById('type').value;
    qrdata = qrdata.toUpperCase().trim();
    category = category.toUpperCase().trim();
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

    alert("Succesfully created Item");  
    Get()
   


}


function modifyItem(ItemID) {

    let category = document.getElementById('modifyCategory').value.toUpperCase();
    let type = document.getElementById('modifyType').value.toUpperCase();
    let status = document.querySelector('input[name="Status"]:checked')?.value.toUpperCase();
    if (!category || !type || !status)
    { 
        alert("Please fill all");
        return;

      }

    fetch('/modify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ItemID: ItemID,
            category: category,
            type: type,
            status: status
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        Get()
    })
    .catch(err => console.error("Error:", err));
}





