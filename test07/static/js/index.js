order = "desc"
limit = 5
token = null
type = "all"
current_memo_id = null

$(document).ready(function () {

    if (sessionStorage.getItem('token') != null) {
        token = sessionStorage.getItem('token')
        decodeToken(token)
        $('#signin_btn').hide()
        $('#signup_btn').hide()
        $('#logout_btn').show()

    } else {
        $('#signin_btn').show()
        $('#signup_btn').show()
        $('#logout_btn').hide()
    }

    getMemos(1)

    $("#select_page_limit").change(function () {
        limit = $(this).val();
        getMemos(1)
    })

    $.ajaxSetup({
        error: function (jqXHR, exception) {
            switch (jqXHR.status) {
                case 401:
                    alert('인증 에러!!');
                    break;
                case 423:
                    alert('중복된 id!!');
                    break;
            }
        },
        beforeSend: function (xhr) {
            if (sessionStorage.getItem('token') != null) {
                xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));
            }
        }
    });
})

function toggleButton() {
    if ($("#post-box").css("display") == "none") {
        $('#edit-button').hide()
        $('#save-button').show()
        $("#post-box").show()
        $("#btn-post-box").text("포스트 박스 닫기")
    } else {
        $('#edit-button').hide()
        $('#save-button').show()
        $("#post-box").hide()
        $('#post-title').val('');
        $('#post-comment').val('');
        $("#btn-post-box").text("포스트 박스 열기")
    }
}

function postMemo() {
    title = $("#post-title").val()
    comment = $("#post-comment").val()

    $.ajax({
        type: "POST",
        url: "/api/memo",
        data: {"title": title, "comment": comment},
        success: function (res) {
            alert(res['msg'])
            window.location.reload()
        }
    })
}

function getMemos(current_page) {
    $('#memo-body').empty()
    $.ajax({
        type: "GET",
        url: `/api/memos?order=${order}&page=${current_page}&limit=${limit}&type=${type}`,
        success: function (res) {
            memos = res['memos']
            for (let i = 0; i < memos.length; i++) {
                memo_number = (i + 1) + limit * (current_page - 1)
                let tmp_html = `<tr>
                                  <th scope="row">${memo_number}</th>
                                  <td><a onclick="getMemo('${memos[i]['memo_id']}')">${memos[i]['title']}</a></td>
                                  <td>${memos[i]['writer_id']}</td>
                                  <td>${memos[i]['date']}</td>
                                  <td>${memos[i]['click']}</td>
                                  <td>
                                    <button onclick="delete_memo('${memos[i]['memo_id']}')" type="button" class="btn btn-danger">삭제</button>
                                  </td>
                                  <td>
                                    <button onclick="show_memo_edit_form('${memos[i]['memo_id']}')" type="button" class="btn btn-primary">수정</button>
                                  </td>
                                </tr>`
                $('#memo-table').append(tmp_html)

                makePagingButtons(res['paging'])
            }

        }
    })
}

function makePagingButtons(paging_info) {
    $('#pagination-buttons').empty()
    total_page = paging_info['total_page']
    current_page = paging_info['page']
    tmp_html = ``
    for (let i = 0; i < total_page; i++) {
        if (current_page == i + 1) {
            tmp_html = `<li class="page-item active"><a class="page-link" onclick="getMemos('${i + 1}')">${i + 1}</a></li>`
        } else {
            tmp_html = `<li class="page-item"><a class="page-link" onclick="getMemos('${i + 1}')">${i + 1}</a></li>`
        }

        $('#pagination-buttons').append(tmp_html)
    }
}

function getMemo(memo_id) {

    current_memo_id = memo_id

    $.ajax({
        type: "GET",
        url: `/api/memo/${memo_id}`,
        success: function (res) {
            let title = res['memo']['title']
            let comment = res['memo']['comment']
            $('#modal-title').html(title);
            $('#modal-content').html(comment);
            $('#articleModal').modal('show');

            let comments = res['comments']

             $('#modal-comment').empty()
            for (let i=0;i<comments.length;i++) {
                let tmp_html = `<li class="list-group-item">${comments[i]['comment']}</li>`
                $('#modal-comment').append(tmp_html)
            }

            getMemos(1)
        }
    })
}

function show_memo_edit_form(memo_id) {
    $.ajax({
        type: "GET",
        url: `/api/memo?id=${memo_id}`,
        success: function (res) {
            let memo_id = res['memo']['memo_id']
            let title = res['memo']['title']
            let comment = res['memo']['comment']

            current_memo_id = memo_id

            $("#post-id").val(memo_id)
            $("#post-title").val(title)
            $('#post-comment').val(comment)
            $('#btn-post-box').text("포스트 박스 닫기")

            $('#edit-button').show()
            $('#save-button').hide()

            $('#post-box').show()
        }
    })
}

function editMemo() {
    memo_id = $('#post-id').val()
    title = $('#post-title').val()
    comment = $('#post-comment').val()
    $.ajax({
        type: "PUT",
        url: `/api/memo`,
        data: {"id": memo_id, "title": title, "comment": comment},
        success: function (res) {
            alert(res['msg'])
            window.location.reload()
        }
    })
}

function delete_memo(memo_id) {
    $.ajax({
        type: "DELETE",
        url: `/api/memo?id=${memo_id}`,
        success: function (res) {
            alert(res['msg'])
            window.location.reload();
        }
    })
}

function sort() {

    order == "asc" ? console.log("오름차순 정렬") : console.log("내림차순정렬")

    if (order == "asc") {
        order = "desc"
        $('#sort-icon').text("⬇️")
    } else {
        order = "asc"
        $('#sort-icon').text("⬆️")
    }

    getMemos(1)
}

function open_signin_modal() {
    $('#signinModal').modal('show');
}

function open_signup_modal() {
    $('#signupModal').modal('show');
}

function signup() {
    console.log('회원가입')
    let signup_id = $('#signup-id').val()
    let signup_pw = $('#signup-pw').val()
    console.log(signup_id, signup_pw)
    let doc = {
        "id": signup_id,
        "pw": signup_pw
    }

    $.ajax({
        type: "POST",
        url: "/signup",
        data: doc,
        success: function (res) {
            alert(res.msg)
            window.location.reload()
        }
    })
}

function signin() {
    console.log('로그인')
    let signin_id = $('#signin-id').val()
    let signin_pw = $('#signin-pw').val()
    let doc = {
        "id": signin_id,
        "pw": signin_pw
    }

    $.ajax({
        type: "POST",
        url: "/signin",
        data: doc,
        success: function (res) {
            alert(res.msg)
            if (res['result'] == 'success') {
                connectSocket(res['id'])
                sessionStorage.setItem('token', res['token'])
                window.location.reload()
            } else {
                alert(res['msg'])
            }

        }
    })
}

function logout() {
    sessionStorage.clear()
    window.location.reload()
}

function set_type(type_param) {
    if (type_param == "my" && token == null) return false

    if (type_param == type) return false

    type = type_param
    getMemos(1)
}

function saveComment() {

    let comment = $('#comment').val()

    console.log(comment)

    $.ajax({
        type: "POST",
        url: "/comment",
        data: {comment: comment, memo_id: current_memo_id},
        success: function (res) {
            if (res.result == "success") {
                alert(res.msg)
                $('#comment').val(' ')
                let tmp_html = `<li class="list-group-item">${comment}</li>`
                $('#modal-comment').append(tmp_html)
            }
        }
    })
}

function connectSocket(id) {
    console.log('connect socket: ', id)
    var socket = io.connect('http://localhost:5000');
    socket.on(id, function () {
        alert("작성하신 글에 댓글이 달렸어요!!");
    })
}

function decodeToken(token) {
    let decoded_id;
    $.ajax({
        type: "GET",
        url: "/token-decode",
        data: {"token": token},
        success: function(res) {
           connectSocket(res['id'])
        }
    })
}

