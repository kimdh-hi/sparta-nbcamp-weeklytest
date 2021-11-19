
$(document).ready(function () {
    getMemos();
})

function openClose() {
    let display = $('#post-box').css("display")
    if (display == "none") {
        $('#post-box').show();
    } else {
        $('#post-box').hide();
    }
}

function postingArticle() {
    let title = $('#title').val()
    let content = $('#content').val();

    let data = {
        "title": title,
        "content": content
    }

    $.ajax({
        type: "POST",
        url: "/memo",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        success: function (res) {
            alert('메모저장')
            window.location.reload();
        }
    })
}

function getMemos() {
    $.ajax({
        type: "GET",
        url: "/memos",
        success: function (res) {
            $('#list-post').empty();

            for (let i = 0; i < res.length; i++) {
                let tmp_html = `<td>${i + 1}</td>
                            <td><a onclick="getMemo('${res[i].id}')">${res[i].title}</a></td>
                            <td>${res[i].commentsCount}</td>
                            <td>${res[i].createdAt}</td>`
                $('#list-post').append(tmp_html);
            }
        }
    })
}

function getMemo(id) {
    $('#wrap').load('../view.html')

    $.ajax({
        type: "GET",
        url: "/memo",
        contentType: "application/json;charset=utf-8",
        data: {"id": id},
        success: function (res) {
            $('#title').val(res['title'])
            $('#content').val(res['content'])
            let comments = res['comments']
            $('#comment-list').empty();
            for (let i = 0; i < comments.length; i++) {
                $('#comment-list').append(`<li>${comments.content}</li>`)
            }
        }
    })
}

function setArticleComment() {
    let comment = $('#comment').val()

    $.ajax({
        type: "POST",
        url: "/comment",
        contentType: "application/json;charset=utf8",
        success: function(res) {
            alert('댓글작성 완료')
            getMemo()
        }
    })
}
