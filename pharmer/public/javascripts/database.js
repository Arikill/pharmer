$(document).ready(function () {

});

$("#send-files").click(function () {
    if ($('.invalid').length === 0) {
        var form_data = new FormData($("#file-form").get(0));
        form_data.append("files", [$("#descriptions")[0].files, $("#cell_values")[0].files, $("#go_terms")[0].files]);
        form_data.append("dbName", $("#database_name").val());
        $.ajax({
            type: "POST",
            url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database",
            data: form_data,
            cache: false,
            processData: false,
            contentType: false,
            success: (response) => {
                console.log(response);
            },
            error: (xhr, errmsg, err) => {
                console.log(xhr.status + ":" + xhr.responseText);
            }
        });
    } else {
        console.log('Please correct errors before upload!');
    }
});