order = "asc"
limit = 5

$(document).ready(function () {
    getMemos(1)

    $("#select_page_limit").change(function() {
        limit = $(this).val();
        getMemos(1)
    })
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
        url: `/api/memos?order=${order}&page=${current_page}&limit=${limit}`,
        success: function (res) {
            memos = res['memos']
            for (let i = 0; i < memos.length; i++) {
                memo_number = (i+1) + limit * (current_page-1)
                let tmp_html = `<tr>
                                  <th scope="row">${memo_number}</th>
                                  <td><a onclick="getMemo('${memos[i]['memo_id']}')">${memos[i]['title']}</a></td>
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
    for (let i=0;i<total_page;i++) {
        if (current_page == i+1) {
            tmp_html = `<li class="page-item active"><a class="page-link" onclick="getMemos('${i+1}')">${i+1}</a></li>`
        } else {
            tmp_html = `<li class="page-item"><a class="page-link" onclick="getMemos('${i+1}')">${i+1}</a></li>`
        }

        $('#pagination-buttons').append(tmp_html)
    }
}

function getMemo(memo_id) {
    $.ajax({
        type: "GET",
        url: `/api/memo/${memo_id}`,
        success: function (res) {
            console.log(res)
            let title = res['memo']['title']
            let comment = res['memo']['comment']
            $('#modal-title').html(title);
            $('#modal-content').html(comment);
            $('#articleModal').modal('show');
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
        success: function(res) {
            alert(res['msg'])
            window.location.reload()
        }
    })
}

function delete_memo(memo_id) {
    $.ajax({
        type: "DELETE",
        url: `/api/memo?id=${memo_id}`,
        success: function(res) {
            alert(res['msg'])
            window.location.reload();
        }
    })
}

function sort() {

    if (order == "asc") {
        order = "desc"
        $('#sort-icon').text("⬇️")
    } else {
        order = "asc"
        $('#sort-icon').text("⬆️")
    }

    getMemos(1)
}

