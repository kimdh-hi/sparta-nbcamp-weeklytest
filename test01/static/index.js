
let code = []
let g_input = []

$(document).ready(function() {
    g_input = []
    code = []
    getCode()
})

function getCode() {
    $.ajax({
        type:"GET",
        url:"/base/codes",
        success: function(res) {
            for (let i=0;i<res.length;i++) {
                code.push(res[i])
            }
        }
    })
}

function getGroup() {
    $('#select-market').empty()
    $('#btn-start').css({"display":"none"})

    $.ajax({
        type: "GET",
        url: `/codes?group=${code[0]}`,
        success: function(res) {
            for (let i=0;i<res.length;i++) {
                let tmp_html = `<p><input class="form-check-input" type="radio" name="groupSelect" id="m-select-${res[i].code}" value="${res[i].code}">
                            <label class="form-check-label" for="m-select-${res[i].code}">${res[i].name}</label></p>`
                $('#select-market').append(tmp_html)
            }
            $('#select-market').append('<p><button type="button" onclick="getSector()" class="btn btn-success">다음</button></p>')
        }
    })
}

function getSector() {
    g_input.push($("input[name='groupSelect']:checked").val())

    $('#select-market').css({"display":"none"})
    $('#select-sector').css({"display":''})
    $('#select-sector').empty()

    $.ajax({
        type: "GET",
        url: `/codes?group=${code[1]}`,
        success: function(res) {
            for(let i=0;i<res.length;i++) {
                let tmp_html = `<p><input class="form-check-input" type="radio" name="groupSector" id=s-select-${res[i].code} value="${res[i].code}">
                              <label class="form-check-label" for=s-select-${res[i].code}>${res[i].name}</label></p>`
                $('#select-sector').append(tmp_html)
            }
            $('#select-sector').append(`<p><button type="button" onclick="getTag()" class="btn btn-success">다음</button></p>`)
        }
    })
}

function getTag() {
    g_input.push($("input[name='groupSector']:checked").val())

    $('#select-sector').css({"display":"none"})
    $('#select-tag').css({"display":""})
    $('#select-tag').empty()

    $.ajax({
        type: "GET",
        url: `/codes?group=${code[2]}`,
        success: function(res) {
            for (let i=0;i<res.length;i++) {
                let tmp_html = `<p><input class="form-check-input" type="radio" name="groupTag" id="t-select-${res[i].code}" value="${res[i].code}">
                            <label class="form-check-label" for="t-select-${res[i].code}">${res[i].name}</label></p>`
                $('#select-tag').append(tmp_html)
            }
            $('#select-tag').append(`<p><button type="button" onclick="getStockInfo()" class="btn btn-success">다음</button></p>`)
        }
    })
}

function getStockInfo() {
    g_input.push($("input[name='groupTag']:checked").val())

    $('#select-tag').css({"display":"none"})
    $('#select-stock-info').empty()
    $('#select-stock-info').css({"display":""})

    $.ajax({
      type: "POST",
      url: '/stock',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({"market":`${g_input[0]}`,"sector":`${g_input[1]}`,"tag":`${g_input[2]}`}),
      success: function (res) {
        for (let i=0;i<res.length;i++) {
            let tmp_code = res[i].code.toString();
            let tmp_html = `<p>${res[i].name}
                            <button type="button" onclick="bookmark('${tmp_code}', ${res.name})" class="btn btn-warning">즐겨찾기</button> 
                            <button type="button" onclick="callStockApi('${tmp_code}')" class="btn btn-info">정보</button></p>`
            $('#select-stock-info').append(tmp_html)
        }
        $('#select-stock-info').append(`<p><button type="button" class="btn btn-secondary" onclick="window.location.reload()">다시선택</button></p>`)
      }
    })
}

function callStockApi(code) {
    console.log(code)
    $.ajax({
        type: "GET",
        url: `/stock?code=${code}`,
        success: function(res) {
            alert(`주가: ${res.price} \n 시총: ${res.amount} \n PER: ${res.per}`)
        }
    })
}

function bookmark(code, name) {
    console.log("bookmark: " + code)
    $.ajax({
        type: "POST",
        url: "/stock/bookmark",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"code": code, "name":name}),
        success: function(res) {
            console.log(res)
        }
    })
}

function getBookmarks() {
    $.ajax({
        type: "GET",
        url: "/stock/bookmark",
        success: function(res) {
            console.log(res)
            let tmp_html = `<table class="table" id="bookmark-table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">종목</th>
                                    <th scope="col">즐겨찾기 취소</th>
                                    <th scope="col">정보</th>
                                </tr>
                                </thead>
                                <tbody>                               
                                <tr>
                                    <th scope="row">1</th>
                                    <td>${res.name}</td>
                                    <td><button type="button" class="btn btn-danger">취소</button></td>
                                    <td><button type="button" class="btn btn-info" onclick="callStockApi(`${res.code}`)">정보</button></td>
                                </tr>
                                </tbody>
                            </table>`
        }
    })
}

function toggle(n) {
    if (n==1) {
        $('#recommend-box').css({"display":""})
        $('#bookmark-box').css({"display":"none"})
        window.location.reload()
    } else {
        $('#recommend-box').css({"display":"none"})

        $('#bookmark-box').css({"display":""})
        getBookmarks()
    }
}
