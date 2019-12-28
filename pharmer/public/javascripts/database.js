$(document).ready(function () {
    getDatabaseList();
});

var getDatabaseList = () => {
    $.ajax({
        type: 'GET',
        url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database/list",
        success: (response) => {
            var db_options = '';
            response.forEach((database) => {
                db_options += '<option class="database_names" value="'+database.name+'">'+database.name+'</option>';
            });
            $("#database_select").empty();
            $("#database_select").html(db_options);
            $("#database_select").formSelect();
            $("#database_select").change(function(e) {
                getDatabaseFields($("#database_select").text());
            });
            $("#database_select").change();
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
        }
    });
}

var getDatabaseFields = (database) => {
    var form_data = new FormData($("#query-form").get(0));
    form_data.append("database", database);
    $.ajax({
        type:'POST',
        url: document.location.protocol + "//" + document.location.hostname + ":" + document.location.port + "/database/fields",
        data: form_data,
        cache: false,
        processData: false,
        contentType: false,
        success: (response) => {
            var fields = '';
            $.each(response, (key, value) => {
                fields += '<option value="'+key+'">'+key+'</option>';
            });
            $("#fields_select").empty();
            $("#fields_select").html(fields);
            $("#fields_select").formSelect();
        },
        error: (xhr, errmsg, err) => {
            console.log(xhr.status + ":" + xhr.responseText);
        }
    });
}

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