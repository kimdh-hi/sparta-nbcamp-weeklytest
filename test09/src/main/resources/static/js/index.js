
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
                            <td><a href=/view?id=${res[i].id}>${res[i].title}</a></td>
                            <td>${res[i].commentsCount}</td>
                            <td>${res[i].createdAt}</td>`
                $('#list-post').append(tmp_html);
            }
        }
    })
}


