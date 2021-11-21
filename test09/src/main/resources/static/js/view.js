let currentId = null
$(document).ready(function(res) {
    currentId = getCurrentMemoId();
    getMemo(currentId)
})

function getCurrentMemoId() {
    let id = new URL(location.href).searchParams.get("id");
   console.log(id)
    return id;
}

function getMemo(id) {
    currentId = id;
    $.ajax({
        type: "GET",
        url: `/memo?id=${id}`,
        success: function (res) {
            let title = res['title']
            let content = res['content']

            $('#title').html(title)
            $('#content').html(content)
            let comments = res['comments']

            $('#comment-list').empty()
            for (let i=0;i<comments.length;i++) {
                let tmp_html = `<li class="list-group-item">${comments[i]}</li>`
                $('#comment-list').append(tmp_html);
            }
        }
    })
}

function setArticleComment() {
    let content = $('#comment').val()
    if (content !== '' && content !== null) {
        let data = {
            "content": content
        }

        $.ajax({
            type: "POST",
            url: `/comment/${currentId}`,
            contentType: "application/json;charset=utf8",
            data: JSON.stringify(data),
            success: function (res) {
                alert('댓글작성 완료')
                $('#comment').val('')
                getMemo(currentId);
            }
        })
    }
}
